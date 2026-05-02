cd /home/ash/.local/share/gnome-shell/extensions/gbinaryclock@isopolito 
find . -name *.orig -delete
find . -name *.png -delete
find . -name *.sh -delete
zip -r gbinaryclock-vX.zip .
mv gbinaryclock-vX.zip ~/tmp
