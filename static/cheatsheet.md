File and Directory Commands
-----
List all files in current directory `ls -al`

Display the present working directory `pwd`

Create a directory `mkdir directory`

Remove (delete) file `rm file`

Remove the directory and its contents recursively `rm -r directory`

Force removal of file without prompting for confirmation `rm -f file`

Forcefully remove directory recursively `rm -rf directory`

Copy file1 to file1 `cp file1 file2`

Copy source_directory recursively to destination. If destination exists, copy source_directory into destination, otherwise create destination with the contents of source_directory. `cp -r source_directory destination`

Rename or move file1 to file2. If file2 is an existing directory, move file1 into directory file2 `mv file1 file2`

Create symbolic link to linkname `ln -s /path/to/file linkname`

Create an empty file or update the access and modification times of file. `touch <file>`

View the contents of file `cat <file>`

Browse through a text file `less <file>`

Display the first 10 lines of file `head <file>`

Display the last 10 lines of a file `tail <file>`

Display the last 10 lines of file and "follow" the file as it grows. `tail -f <file>`

To go up one level of the directory tree. (Change into the parent directory.) `cd ..`

To go the the `$HOME` directory `cd`

Change to the /etc directory `cd /etc`

C++ Compilation and Debugging
---
Compile a C++ program named main.cpp `g++ main.cpp`

Compile a C++ program named main.cpp and create an executable main.exe `g++ main.cpp -o main.exe`

Compile a C++ program named main.cpp using C++11 libraries (necessary to use `nullptr`) `g++ main.cpp -std=c++11`

SSH Logins
---
Connect to host as your local username `ssh host`

Connect to host as user `ssh user@host`

Connect to host using port `ssh -p port user@host`

Disk Usage
---
Show free and used space on mounted filesystems `df -h`

Show free and used inodes on mounted filesystem `df -i`

Display disks partitions sizes and types `fdsisk -l`

Display disk usage for all files and directories in human readable format `du -ah`

Display total disk usage off the current directory `du sh`

Search
--
Search for regex pattern in file `grep <pattern> <file>`

Search recursively for pattern in directory `grep -r <pattern> <directory>`

Find files and directories by name `locate <name>`

Find files in /home/john that start with "prefix". `find /home/john -name 'prefix'`

Find files larger than 100MB in /home `find /home -size +100M`

Process Management
---
Display your currently running processes `ps`

Display all the currently running processes on the system.`ps -ef`

Display process information for processname `ps -ef | grep <proccessname>`

Kill process with process ID of pid `kill <pid>`

Kill all processes named processname `killall <processname>`

Start program in the background `program &`

Display stopped or background jobs `bg`

Brings the most recent background job to foreground `fg`

Brings job n to the foreground `fg n`

System Information
-----------------------
Display Linux system information `uname -a`

Display kernel release information `uname -r`

Show how long the system has been running + load `uptime`

Show system host name `hostname`

Display the IP addresses of the hostname `hostname -I`

Show system reboot history `last reboot`

Show the current date and time `date`

Show this month's calendar `cal`

Display who is online `w`

Who you are logged in as `whoami`

Hardware Information
-------
Display messages in kernel ring buffer `dmesg`

Display CPU information `cat /proc/cpuinfo`

Display memory information `cat /proc/meminfo`

Display free and used memory ( -h for human readable, -m for MB, -g for GB.) `free -h`

Display PCI devices `lspci -tv`

Display USB devices `lsusb -tv`

Display DMI/SMBIOS (hardware info) from the BIOS `dmidecode`

Show info about disk sda `hdparm -i /dev/sda`

Perform a read speed test on disk sda `hdparm -tT /dev/sda`

Test for unreadable blocks on disk sda `badblocks -s /dev/sda`

Performance Monitoring and Statistics
---------------
Display and manage the top processes `top`

Interactive process viewer (top alternative) `htop`

Display processor related statistics `mpstat 1`

Display virtual memory statistics `vmstat 1`

Display I/O statistics `iostat 1`

Display the last 100 syslog messages `tail 100 /var/log/syslog`

Capture and display all packets on interface eth0 `tcpdump -i eth0`

Monitor all traffic on port 80 ( HTTP ) `tcpdump -i eth0 'port 80'`

List all open files on the system `lsof`

List files opened by user `lsof -u <user>`

Display free and used memory ( -h for human readable, -m for MB, -g for GB.) `free -h`

User Information and Management
--------------
Display the user and group ids of your current user. `id`

Display the last users who have logged onto the system.  `last`

Create a group named "test". `groupadd test`

Create an account named john, with a comment of "John Smith" and create the user's home directory. `useradd -c "John Smith" -m john`

Delete the john account. `userdel john`

Add the john account to the sales group `usermod -aG sales john`
