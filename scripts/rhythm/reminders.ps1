<#
.SYNOPSIS
    Installs, lists or removes the timetable reminders as Windows scheduled tasks.

.DESCRIPTION
    Each reminder is a task in the Task Scheduler folder \Rhythm\ that runs
    toast.ps1 at a fixed time. They run only while you are logged in, need no
    admin rights, and touch nothing else on the machine.

    The times follow the evening-course timetable in
    "01 Projects/MAF/MAF — Roadmap, Protocol and Timetable.md", section 4.
    Change a time by editing the $Reminders table below and running -Install again.

.EXAMPLE
    .\reminders.ps1 -Install
.EXAMPLE
    .\reminders.ps1 -List
.EXAMPLE
    .\reminders.ps1 -Remove
#>
param(
    [switch]$Install,
    [switch]$List,
    [switch]$Remove
)

$folder = "\Rhythm\"
$toast = Join-Path $PSScriptRoot "toast.ps1"

# Name, days, time, title, body
$Reminders = @(
    @("Dawn study",     "Monday,Wednesday,Friday", "05:50", "Study block, 50 min",     "Review yesterday's page, 3-5 flashcards, 1 exam question. Desktop: Study 25."),
    @("Dawn writing",   "Tuesday,Thursday",        "05:50", "Writing block, 50 min",   "Fiction. Door shut, timer on. Desktop: Write 25."),
    @("Pre-read",       "Monday,Tuesday,Wednesday,Thursday,Friday", "16:30", "Pre-read, 20 min", "Skim tonight's slides. Go into class with one question."),
    @("Notes",          "Monday,Tuesday,Thursday", "19:45", "One-page notes",          "Cornell page + flashcards while class is fresh. 45 min."),
    @("Study group",    "Wednesday",               "19:45", "Study group",             "Explain one topic to the other two."),
    @("Evening log",    "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday", "21:00", "Evening log: claim your XP", "Five lines, tick log. Then screens off by 21:30."),
    @("Hard stop",      "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday", "21:30", "Hard stop", "Screens off. Blood pressure and sleep come first."),
    @("Saturday deep",  "Saturday",                "08:30", "Deep study, 2 x 100 min", "Assignment or dissertation. Break in the middle."),
    @("Sunday writing", "Sunday",                  "07:00", "Writing, 90 min",         "1st/3rd Sunday fiction, 2nd draft the essay, 4th revise and post it."),
    @("Weekly review",  "Sunday",                  "16:00", "Weekly review",           "Flashcards, check The Game's quests, plan the week in 30 min.")
)

if ($Install) {
    foreach ($r in $Reminders) {
        $name, $days, $time, $title, $body = $r
        $arg = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$toast`" -Title `"$title`" -Body `"$body`""
        $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arg
        $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek ($days -split ",") -At $time
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable:$false -ExecutionTimeLimit (New-TimeSpan -Minutes 2)
        Register-ScheduledTask -TaskPath $folder -TaskName $name -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
        Write-Host ("  {0,-15} {1}  {2}" -f $name, $time, $days)
    }
    Write-Host "`n  $($Reminders.Count) reminders installed in Task Scheduler > $folder" -ForegroundColor Green
}
elseif ($Remove) {
    Get-ScheduledTask -TaskPath $folder -ErrorAction SilentlyContinue | Unregister-ScheduledTask -Confirm:$false
    Write-Host "  All reminders in $folder removed." -ForegroundColor Yellow
}
else {
    Get-ScheduledTask -TaskPath $folder -ErrorAction SilentlyContinue |
        ForEach-Object {
            $info = $_ | Get-ScheduledTaskInfo
            "{0,-15} next: {1}" -f $_.TaskName, $info.NextRunTime
        }
}
