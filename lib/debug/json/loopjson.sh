#!/usr/bin/env sh
while read p; do  
echo $p | python -mjson.tool | cat >> $2; 
done <$1
