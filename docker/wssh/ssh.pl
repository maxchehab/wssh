#!/usr/bin/perl

my $user_at_address = $ARGV[0];
my @u_a = split(/@/, $user_at_address);

if (defined $u_a[1])
{
    if ( $^O == 'linux' )
    {
        exec ("/usr/bin/ssh $u_a[0]\@$u_a[1]");
    }
    if ( $^O == 'solaris' )
    {
        exec ("/usr/local/bin/ssh $u_a[0]\@$u_a[1]");
    }
}
else
{
    print "Enter your username: ";
    my $username = <STDIN>;
    chomp ( $username );
    if ( $^O == 'linux' )
    {
        exec ("/usr/bin/ssh $username\@$u_a[0]");
    }
    if ( $^O == 'solaris' )
    {
        exec ("/usr/local/bin/ssh $username\@$u_a[0]");
    }
}
