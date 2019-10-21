/*
    extensie activeren met gnome tweaks
    na elke wijziging ctrl+f2 en vervolgens r en enter indrukken om wijzigingen te zien.
*/
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;
const Lang = imports.lang;


let text, button,binaryCalc,dateMenu,updateClockId,tz,date,strHour,strMinute,strSeconds,context,size,width,height,arcwidth,archeight,radius,spacing;

function _showHello() {
    binaryCalc.queue_repaint()
}

function getCircle(x,y,time) {
  return {x: 2,y: 2,r: 5  };
}

function _repaintevent(stdrawingarea,user_data) {

      if(!tz) {
        tz = dateMenu._clock.get_timezone();
      }
      date = GLib.DateTime.new_now(tz);
      strHour = date.get_hour();
      strMinute = date.get_minute();
      strSeconds = date.get_second();


      context = stdrawingarea.get_context();
      size = stdrawingarea.get_surface_size();
      width = size[0];
      height = size[1];

      arcwidth = height / 4;
      archeight = arcwidth;
      radius = arcwidth / 2 ;
      spacing = 5;
      context.setSourceRGB(.6,.6,.6);
      /*arc(xc, yc, radius, angle1, angle2)*/
      context.arc(radius, archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius, 2*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius, 3*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth+ spacing, radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth+ spacing, archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth+ spacing, 2*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      if( date.get_second() % 2 === 0) {
      context.setSourceRGB(1,1,1);
      context.arc(radius + arcwidth+ spacing, 3*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.setSourceRGB(.6,.6,.6);
      }
      else {
        context.arc(radius + arcwidth+ spacing, 3*archeight + radius, radius, 0, 4 * Math.PI);
        context.fill();
      }
      
      //context.arc(radius + arcwidth * 2+ spacing + spacing, radius, radius, 0, 4 * Math.PI);
      //context.fill();
      context.arc(radius + arcwidth * 2+ spacing + spacing, archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 2+ spacing + spacing, 2*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 2+ spacing + spacing, 3*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      
      context.arc(radius + arcwidth * 3+ spacing + spacing+ spacing, radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 3+ spacing+ spacing+ spacing, archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 3+ spacing+ spacing+ spacing, 2*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 3+ spacing+ spacing+ spacing, 3*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      
      //context.arc(radius + arcwidth * 4+ spacing+ spacing+ spacing+ spacing, radius, radius, 0, 4 * Math.PI);
      //context.fill();
      context.arc(radius + arcwidth * 4+ spacing+ spacing+ spacing+ spacing, archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 4+ spacing+ spacing+ spacing+ spacing, 2*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 4+ spacing+ spacing+ spacing+ spacing, 3*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      
      context.arc(radius + arcwidth * 5+ spacing+ spacing+ spacing+ spacing+ spacing, radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 5+ spacing+ spacing+ spacing+ spacing+ spacing, archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 5+ spacing+ spacing+ spacing+ spacing+ spacing, 2*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      context.arc(radius + arcwidth * 5+ spacing+ spacing+ spacing+ spacing+ spacing, 3*archeight + radius, radius, 0, 4 * Math.PI);
      context.fill();
      
      
      context.fill();
      
      
}

function init() {
    button = new St.Bin({     width: 80,
                              height: 20,
                              style: 'padding:0;margin:0;' });
    binaryCalc = new St.DrawingArea({ width: 80,
                                      height: 32,
                                      style: 'padding:0;margin:0;/*border: 1px solid #fff;*/' });
    button.set_child(binaryCalc);
    binaryCalc.connect('repaint',_repaintevent);
    
    
    dateMenu = Main.panel.statusArea['dateMenu'];
    if (!dateMenu) {
        log('No dateMenu panel element defined.');
        return;
    }
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
    if (!dateMenu) {
        return;
    }

    if (updateClockId != 0) {
        dateMenu._clock.disconnect(updateClockId);
    }

    updateClockId = dateMenu._clock.connect('notify::clock', Lang.bind(dateMenu, _showHello));
}

function disable() {
    Main.panel._rightBox.remove_child(button);
    if (!dateMenu) {
        return;
    }

    if (updateClockId != 0) {
        dateMenu._clock.disconnect(updateClockId);
        updateClockId = 0;
    }
}
