#!/usr/bin/perl
my $init;
open(my $fh, '<', "init.sh") or die "cannot open file"; {
    local $/;
    $init = <$fh>;
}
close($fh);

print "Enter your username: ";
my $username = <STDIN>;
chomp ( $username );
$username =~ s/[^a-zA-Z0-9]//g;
if ($username eq ""){
    print "Invalid username.\n";
}else {
    print "$username\@ada.gonzaga.edu's password: ";
    use Term::ReadKey;
    ReadMode('noecho');
    my $password = ReadLine(0);
    ReadMode('normal');
    print "\n";
    my $status = system ("sshpass -p '$password' ssh -t $username\@ada.gonzaga.edu '$init'");
    exec("echo $status");
}