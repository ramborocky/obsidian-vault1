package tz.rhythm.soma;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Shows a reminder or the timer alert, then books that reminder's next occurrence. */
public class ReminderReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String id = intent.getStringExtra("id");
        if (id == null) return;
        String title = intent.getStringExtra("title");
        String body = intent.getStringExtra("body");
        if ("timer".equals(id)) {
            Reminders.show(context, Reminders.TIMER_ID, title != null ? title : "Time's up", body != null ? body : "");
            return;
        }
        Reminders.show(context, id.hashCode(), title != null ? title : "Soma", body != null ? body : "");
        Reminders.rescheduleById(context, id);
    }
}
