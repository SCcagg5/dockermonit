while [[ 1 ]]; do
  data=$(docker stats --format "{{json .}}," --no-stream -a);
  mem=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
  proc=$(echo "scale=2; 100 - $(iostat -c | tail -n 3 | head -n 1 | cut -d' ' -f31)" | bc -l)
  echo "{\"memory\" : $mem, \"CPU\": $proc, \"containers\":  [${data::-1}]}" > /var/www/html/index.html;
done;
