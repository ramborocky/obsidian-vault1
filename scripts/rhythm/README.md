# Rhythm — reminders and timers

Windows tooling behind [[The Game]] and the evening-course timetable. All of it runs offline and needs no admin rights.

## Timers (desktop)

| Shortcut | What it runs |
|---|---|
| **Write 25** | `pomodoro.ps1 -Rounds 1 -LongBreak 0 -Score write`: one 25-minute block. Adds the minutes to `write_min` in today's daily note |
| **Study 25** | Same, but adds to `study_min` |

Want 50 minutes? Run it twice, or from a terminal:

```powershell
& "$HOME\Documents\Obsidian Vault\scripts\pomodoro.ps1" -Rounds 2 -Break 5 -LongBreak 0 -Task "Chantal" -Score write
```

If you stop early with Ctrl+C, the whole minutes you've done are still credited. If today's note doesn't exist yet, the timer creates it from `Templates2/Daily Note.md`.

## Reminders (Task Scheduler > `\Rhythm\`)

| Reminder | When |
|---|---|
| Dawn study | Mon, Wed, Fri 05:50 |
| Dawn writing | Tue, Thu 05:50 |
| Pre-read | weekdays 16:30 |
| Notes | Mon, Tue, Thu 19:45 |
| Study group | Wed 19:45 |
| Evening log | daily 21:00 |
| Hard stop | daily 21:30 |
| Saturday deep | Sat 08:30 |
| Sunday writing | Sun 07:00 |
| Weekly review | Sun 16:00 |

Each one stays on screen until you click **Done** or **Snooze**.

```powershell
.\reminders.ps1 -List      # next run time of each
.\reminders.ps1 -Install   # after editing a time in the script
.\reminders.ps1 -Remove    # turn them all off
```

**Ramadan:** run `-Remove` and re-install with the Ramadan times (see the MAF note, §4), or simply snooze the clashing ones.
