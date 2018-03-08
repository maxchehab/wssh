#!/usr/bin/perl
no warnings;
use feature 'say';
use Term::ReadKey;

my $init;
open(my $ifh, '<', "init.sh") or die "cannot open file"; {
    local $/;
    $init = <$ifh>;
}
close($ifh);


my $address;
open(my $afh, '<', "address") or $address = ""; {
    local $/;
    $address = <$afh>;
}
close($ufh);

my $username;
open(my $ufh, '<', "username") or $username = ""; {
    local $/;
    $username = <$ufh>;
}
close($ufh);

$address = `bash -c "read -p 'Enter remote address: ' -i '$address' -e 'ADDRESS' && echo \\\$ADDRESS"`;
chomp ( $address );
$address =~ s/[^a-zA-Z0-9\.]//g;

if($address eq "") {
    print "Invalid address.\n"
} else {
    open(my $afh, '>', "address") or die "cannot open file";
    print $afh "$address";
    close $afh;
}


$username = `bash -c "read -p 'Enter your username: ' -i '$username' -e 'USERNAME' && echo \\\$USERNAME"`;
chomp ( $username );
$username =~ s/[^a-zA-Z0-9]//g;

if ($username eq ""){
    print "Invalid username.\n";
} else {
    open(my $ufh, '>', "username") or die "cannot open file";
    print $ufh "$username";
    close $ufh;

    printf("%s\@%s's password: ", $username, $address);
    ReadMode('noecho');
    my $password = ReadLine(0);
    ReadMode('normal');
    $password =~ s/[\n\r]//g;

    open(my $pfh, '>', "password") or die "cannot open file";
    print $pfh "$password";
    close $pfh;

    print "\n";
    exec("sshpass -p '$password' ssh -t $username\@$address '$init'");
}