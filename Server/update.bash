while [[ 1 ]]; do
  data=$(docker stats --format "{{json .}}," --no-stream -a);
  mem=$(echo "scale=2; $(free -m | grep -oP '\d+' | head -n 2 | tail -n 1) / $(free -m | grep -oP '\d+' | head -n 6 | tail -n 1) * 100" | bc -l)
  proc=$(echo "scale=2; 100 - $(iostat -c | tail -n 3 | head -n 1 | cut -d' ' -f31)" | bc -l)
  echo "{\"memory\" : $mem, \"CPU\": $proc, \"containers\":  [${data::-1}]}" > /var/www/html/index.html;
done;
