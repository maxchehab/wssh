if ! ( cat ~/.bashrc | grep -q "#ADAWEBFLAG" ); then 
    ( printf "\n\n#ADAWEBFLAG\nif ! [[ -z \$ADAWEBTERM ]]; then\n\t"; echo "PS1=\"\[\e]0;\u@\h: \w\a\]\${debian_chroot:+(\$debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ \""; printf "fi\n" ) >> ~/.bashrc
fi
export ADAWEBTERM="true"
bash -l