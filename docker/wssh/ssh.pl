#!/usr/bin/perl

my @u_a = $ARGV[0];

print "Enter your username: ";
my $username = <STDIN>;
chomp ( $username );
$username =~ s/[^a-zA-Z0-9]//g;
exec ("/usr/bin/ssh $username\@$u_a[0]");


