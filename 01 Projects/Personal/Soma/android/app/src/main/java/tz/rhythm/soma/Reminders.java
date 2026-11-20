package tz.rhythm.soma;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;

/**
 * Timetable reminders and the focus-timer alert, built on AlarmManager.
 *
 * Alarms are exact when the exact-alarm permission is held (see the manifest), and fall back
 * to inexact ones, which Android may deliver minutes late, when it isn't. Each reminder
 * schedules only its next occurrence, and re-schedules itself when it fires.
 */
final class Reminders {
    static final String CHANNEL = "soma";
    static final String PREFS = "soma";
    static final String KEY_LIST = "reminders";
    static final int TIMER_ID = 9999;

    private Reminders() { }

    static void ensureChannel(Context c) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm.getNotificationChannel(CHANNEL) == null) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Study reminders", NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Timetable reminders and focus-timer alerts from Soma");
            nm.createNotificationChannel(ch);
        }
    }

    /** Replaces the stored list and schedules each one. An empty list cancels them all. */
    static void setAll(Context c, String json) throws Exception {
        cancelAll(c);
        prefs(c).edit().putString(KEY_LIST, json).apply();
        JSONArray list = new JSONArray(json);
        for (int i = 0; i < list.length(); i++) scheduleNext(c, list.getJSONObject(i));
    }

    /** Called after a reboot: put every stored reminder back. */
    static void restore(Context c) {
        try {
            JSONArray list = new JSONArray(prefs(c).getString(KEY_LIST, "[]"));
            for (int i = 0; i < list.length(); i++) scheduleNext(c, list.getJSONObject(i));
        } catch (Exception ignored) {
            // A corrupt list is dropped; the user can switch reminders on again in Settings.
        }
    }

    /** Called when a reminder fires, to book its next occurrence. */
    static void rescheduleById(Context c, String id) {
        try {
            JSONArray list = new JSONArray(prefs(c).getString(KEY_LIST, "[]"));
            for (int i = 0; i < list.length(); i++) {
                JSONObject r = list.getJSONObject(i);
                if (id.equals(r.optString("id"))) { scheduleNext(c, r); return; }
            }
        } catch (Exception ignored) { }
    }

    static void scheduleNext(Context c, JSONObject r) throws Exception {
        String[] hm = r.getString("at").split(":");
        int hour = Integer.parseInt(hm[0]), minute = Integer.parseInt(hm[1]);
        JSONArray days = r.getJSONArray("days");
        Calendar now = Calendar.getInstance();
        for (int offset = 0; offset <= 7; offset++) {
            Calendar t = (Calendar) now.clone();
            t.add(Calendar.DAY_OF_YEAR, offset);
            t.set(Calendar.HOUR_OF_DAY, hour);
            t.set(Calendar.MINUTE, minute);
            t.set(Calendar.SECOND, 0);
            t.set(Calendar.MILLISECOND, 0);
            int jsDay = t.get(Calendar.DAY_OF_WEEK) - 1; // Calendar: 1 = Sunday; the app: 0 = Sunday
            if (t.after(now) && contains(days, jsDay)) {
                Intent i = new Intent(c, ReminderReceiver.class)
                        .putExtra("id", r.getString("id"))
                        .putExtra("title", r.optString("title", "Soma"))
                        .putExtra("body", r.optString("body", ""));
                alarm(c, t.getTimeInMillis(), pending(c, r.getString("id").hashCode(), i));
                return;
            }
        }
    }

    static void scheduleTimer(Context c, long atMs, String title) {
        Intent i = new Intent(c, ReminderReceiver.class)
                .putExtra("id", "timer").putExtra("title", title).putExtra("body", "Open Soma to log the block.");
        alarm(c, atMs, pending(c, TIMER_ID, i));
    }

    static void cancelTimer(Context c) {
        am(c).cancel(pending(c, TIMER_ID, new Intent(c, ReminderReceiver.class)));
    }

    static void cancelAll(Context c) {
        try {
            JSONArray list = new JSONArray(prefs(c).getString(KEY_LIST, "[]"));
            for (int i = 0; i < list.length(); i++) {
                String id = list.getJSONObject(i).getString("id");
                am(c).cancel(pending(c, id.hashCode(), new Intent(c, ReminderReceiver.class)));
            }
        } catch (Exception ignored) { }
    }

    static void show(Context c, int notifId, String title, String body) {
        ensureChannel(c);
        Intent open = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent tap = PendingIntent.getActivity(c, 0, open, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        Notification n = new Notification.Builder(c, CHANNEL)
                .setSmallIcon(R.drawable.ic_notify)
                .setContentTitle(title)
                .setContentText(body)
                .setContentIntent(tap)
                .setAutoCancel(true)
                .setCategory(Notification.CATEGORY_REMINDER)
                .build();
        try {
            ((NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE)).notify(notifId, n);
        } catch (SecurityException ignored) {
            // Notifications not allowed: the reminder is silently skipped, never a crash.
        }
    }

    private static boolean contains(JSONArray a, int v) throws Exception {
        for (int i = 0; i < a.length(); i++) if (a.getInt(i) == v) return true;
        return false;
    }

    private static void alarm(Context c, long at, PendingIntent pi) {
        AlarmManager am = am(c);
        boolean exact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || am.canScheduleExactAlarms();
        if (exact) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
    }

    private static PendingIntent pending(Context c, int code, Intent i) {
        return PendingIntent.getBroadcast(c, code, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private static AlarmManager am(Context c) { return (AlarmManager) c.getSystemService(Context.ALARM_SERVICE); }

    private static SharedPreferences prefs(Context c) { return c.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }
}
