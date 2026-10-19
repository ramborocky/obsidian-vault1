<#
.SYNOPSIS
    Shows one Windows reminder notification that stays on screen until dismissed.

.EXAMPLE
    .\toast.ps1 -Title "Pre-read" -Body "20 minutes before class."

.NOTES
    Called by the scheduled tasks that reminders.ps1 installs. Runs offline,
    needs no module. Falls back to a tray balloon if toasts are unavailable.
#>
param(
    [Parameter(Mandatory)][string]$Title,
    [Parameter(Mandatory)][string]$Body
)

$esc = { param($s) [Security.SecurityElement]::Escape($s) }

try {
    [Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
    [Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom.XmlDocument, ContentType = WindowsRuntime] | Out-Null

    # scenario="reminder" keeps it on screen until you act on it.
    $xml = New-Object Windows.Data.Xml.Dom.XmlDocument
    $xml.LoadXml(@"
<toast scenario="reminder">
  <visual><binding template="ToastGeneric">
    <text>$(& $esc $Title)</text>
    <text>$(& $esc $Body)</text>
  </binding></visual>
  <audio src="ms-winsoundevent:Notification.Reminder"/>
  <actions>
    <action activationType="system" arguments="snooze" content="Snooze"/>
    <action activationType="system" arguments="dismiss" content="Done"/>
  </actions>
</toast>
"@)
    # Windows PowerShell's own app id, so no registration is needed.
    $app = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'
    $toast = New-Object Windows.UI.Notifications.ToastNotification $xml
    [Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($app).Show($toast)
}
catch {
    Add-Type -AssemblyName System.Windows.Forms
    $tray = New-Object System.Windows.Forms.NotifyIcon
    $tray.Icon = [System.Drawing.SystemIcons]::Information
    $tray.Visible = $true
    $tray.ShowBalloonTip(30000, $Title, $Body, "Info")
    Start-Sleep -Seconds 30
    $tray.Dispose()
}
