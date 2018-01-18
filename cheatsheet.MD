# Command Line Crash Course

## Usage
Note: Hold option (`alt`) and click a position in the current line to move your cursor to that position. 

Clear history: `ctrl + l`

Clear everything left from current cursor position: `ctrl + u`

Clear everything right from current cursor position: `ctrl + k`

Re-call last input with sudo: `sudo !!`

Stop current process: `ctrl + c`

Jump to left: `ctrl + a`

Jump to right: `ctrl + e`

Help: `help cd` / `help dir` (...)

Finding Help: `apropos directory` / `apropos search` (...)

Define custom startup screen: `sudo nano /etc/motd`

Run a script as background process: `python script.py &`

List all running process's: `ps aux`

Kill a running process: `sudo kill 12345`


System
-----------

Get the current path: `pwd`

Copy to clipboard: `pwd | pbcopy`

Paste: `pbpaste`

Get the current hostname: `hostname`

Get the current users: `users`

Get all info about the environment: `env`

Show calendar: `cal`

Show today's date: `date`

Exit terminal: `exit`



Permissions
-----------
Use `-R` option to change permissions recursively.


List: `ps -ef | grep apache | grep -v grep`

Change permissions: `chmod 755 index.php`

Change owner: `chown root index.php` (`root` is the username)

Change group: `chgrp www-data index.php` (`www-data` is the groupname)


Folder Permissions
-----------

Let apache be owner: `chown www-data:www-data -R *`

Change directory permissions rwxr-xr-x: `find . -type d -exec chmod 755 {} \;`

Change file permissions rw-r--r--: `find . -type f -exec chmod 644 {} \;`


Directories
-----------

List directory contents: `ls`

List all directory contents sorted by time edited: `ls -alt`

List directory (wildcard matching): `ls *.txt`

List all files of type: `find . -name "*.txt" -print`


Go back to previous directory: `cd -`


Make (empty) directory: `mkdir sample-dirname`

Remove (empty) directory: `rmdir sample-dirname`

Remove directory with all contents: `rm -rf sample-dirname/`

Remove directory contents and keep directory: `rm -rf *`

Checkout directory: `cd sample-dirname`

Browsing directories: `pushd sample-dirname` / `popd` / `dirs` 
(see http://unix.stackexchange.com/a/77081)

### Symlinks

Create symlink: `ln -s source-dirname destination-dirname`

Update symlink: `ln -sfn source-dirname destination-dirname`

Remove symlink: `unlink sample-dirname`

- `-s`: Create a symbolic link.
- `-f`: If the target file already exists, then unlink it.
- `-F`: If the target file already exists and is a directory, then remove/overwrite it.
- `-h`: If the target file or directory is a symbolic link, do not follow it.
- `-n`: Same as `-h`, for compatibility with other `ln` implementations.


Files
-----------

Make (empty) file: `touch sample-filename.txt`

Change creation date: `touch –t 201401011337 sample-filename.txt`

Change modified date: `touch –mt 201401011337 sample-filename.txt`

Duplicate file: `cp sample-filename.txt sample-filename-copy.txt`

Copy/Page folder with content: `cp -a folder/ new_folder`

Move/Rename file: `mv current-filename.txt new-filename.txt`

Move/Rename file and prompt before overwriting an existing file: `mv -i current-filename.txt new-filename.txt`

Remove file: `rm sample-filename.txt`

View file: `less sample-filename.txt` / `more sample-filename.txt`

Write to file (will overwrite existing content): `cat > sample-filename.txt` (quit with `ctrl+d`)

Search for a filename (not content!) in the current directory: `find sample-filename.txt`

Search for a string (not filename!) inside all files in the current directory: `ack "string" --php` ([documentation](https://beyondgrep.com/documentation/))

Search for a string inside all files in the current directory and subdrectories: `grep -r "string" *`

Search and replace within file: `sed -i '' 's/original-text/new-text/g' sample-filename.txt`

MD5 hash for files: `md5 sample-filename.txt` 

MD5 hash for folders: `tar c folder | md5sum`

Encrypt file: `openssl enc -aes-256-cbc -e -in sample-filename.txt -out sample-encrypted.txt`

Decrypt file: `openssl enc -aes-256-cbc -d -in sample-encrypted.txt -out sample-filename.txt`


Server
-----------
Access via ssh: `ssh pi@192.168.0.0`

Copy file from server to local: `scp pi@192.168.0.0:/path/to/file.png ~/Desktop/` 
(use `-r` to recursively get complete folder)

Copy file from local to server: `scp ~/Desktop/file.png pi@192.168.0.0:/path/to/folder ` 
(use `-r` to recursively get complete folder)

Escape files with spaces in name like this: `/path/to/file\\\ name.png`


Variables
-----------

Register variable: `export TESTING="Sample Text"`

Echo variable: `echo $TESTING`

Unset variable: `unset TESTING`


Output & Redirects
-----------

Write to file: `echo "Hello" > hello.txt`

Append content from a file to another file: `cat file1.txt >> file2.txt`

Add the amount of lines, words, and characters to `file2.txt`: `cat file1.txt | wc | cat > file2.txt`

Sort the content of a file (like `cat`): `sort hello.txt`

Save to sorted content to a new file: `cat file1.txt | sort > sorted-file1.txt`

Sort and remove duplicates and save to a new file: `sort file1.txt | uniq > uniq-file1.txt`


Functions
-----------
Calculate (returns only `int`): `echo $((123/2))`


Web
-----------
Check site feedback: `ping google.com`

Show site IP: `dig +short google.com`

Show A Record: `dig a google.com` (Returns: `google.com.	43	IN	A	123.123.123.123` aka `public-name ttl internet record-type server-address`)

Webservice: https://www.whatsmydns.net/

