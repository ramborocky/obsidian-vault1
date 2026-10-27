package tz.rhythm.soma;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Android clears alarms on reboot. This puts the timetable reminders back. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Reminders.restore(context);
        }
    }
}
