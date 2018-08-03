#!/bin/sh
DIR=`date +%m%d%y`
DEST=~/Desktop/sign/signin-authentication/db_backup/$DIR
mkdir $DEST
mongodump -h localhost -d userdb -o $DEST