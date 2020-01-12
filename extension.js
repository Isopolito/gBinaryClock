const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Gio = imports.gi.Gio;


let button,binaryCalc,dateMenu,updateClockId,tz,date,strHour,strMinute,strSeconds,context,size,width,height,arcwidth,archeight,radius,spacing,repaintConnection,boxlayout,displaySeconds;

function _triggerRepaint() {
    binaryCalc.queue_repaint()
}

/* makes sure the number get's a 0 prepended if it's only a single digit */ 
function _doubleDigitTime(num){
  if(num.toString().length == 1){
    return "0"+num.toString()
  }
  else {
    return num.toString()
  }
}

/* returns the binary representation of a number */
function _getBinary(num) {
      if(num == 0) {
        return { eight: 0, four: 0,two: 0,one: 0 }
      }
      if (num == 1) {
        return { eight: 0, four: 0,two: 0,one: 1 }
      }
       if (num == 2) {
        return { eight: 0, four: 0,two: 1,one: 0 }
      }
       if (num == 3) {
        return { eight: 0, four: 0,two: 1,one: 1 }
      }
       if (num == 4) {
        return { eight: 0, four: 1,two: 0,one: 0 }
      }
       if (num == 5) {
        return { eight: 0, four: 1,two: 0,one: 1 }
      }
       if (num == 6) {
        return { eight: 0, four: 1,two: 1,one: 0 }
      }
       if (num == 7) {
        return { eight: 0, four: 1,two: 1,one: 1 }
      }
       if (num == 8) {
        return { eight: 1, four: 0,two: 0,one: 0 }
      }
       if (num == 9) {
        return { eight: 1, four: 0,two: 0,one: 1 }
      }
      else
      {
       return { eight: 1, four: 0,two: 0,one: 1 }
      }
}

/*This should happen on every clock update (and coincidentally on every gnome overview invocation */
function _repaintevent(stdrawingarea,user_data) {

      tz = dateMenu._clock.get_timezone();
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
      
      let digit = _getBinary(parseInt(_doubleDigitTime(strHour).charAt(0)));
      var i = 0;
      for(var x in digit)
      {
          if(digit[x] == 1) {
          context.setSourceRGB(1,1,1);
          context.arc(radius, i*archeight + radius, radius, 0, 4 * Math.PI);
          context.fill();
          context.setSourceRGB(.6,.6,.6);
          }
          else {
            context.arc(radius, i*archeight + radius, radius, 0, 4 * Math.PI);
            context.fill();
          }
          i++;
      }
      
      digit = _getBinary(parseInt(_doubleDigitTime(strHour).charAt(1)));
      i = 0;
      for(var x in digit)
      {
          if(digit[x] == 1) {
          context.setSourceRGB(1,1,1);
          context.arc(radius + arcwidth+ spacing, i*archeight + radius, radius, 0, 4 * Math.PI);
          context.fill();
          context.setSourceRGB(.6,.6,.6);
          }
          else {
            context.arc(radius + arcwidth+ spacing, i*archeight + radius, radius, 0, 4 * Math.PI);
            context.fill();
          }
          i++;
      }
      
      digit = _getBinary(parseInt(_doubleDigitTime(strMinute).charAt(0)));
      i = 0;
      for(var x in digit)
      {
          if(digit[x] == 1) {
          context.setSourceRGB(1,1,1);
          context.arc(radius + arcwidth * 2+ spacing + spacing, i*archeight + radius, radius, 0, 4 * Math.PI);
          context.fill();
          context.setSourceRGB(.6,.6,.6);
          }
          else {
            context.arc(radius + arcwidth * 2+ spacing + spacing, i*archeight + radius, radius, 0, 4 * Math.PI);
            context.fill();
          }
          i++;
      }
      
      
      digit = _getBinary(parseInt(_doubleDigitTime(strMinute).charAt(1)));
      i = 0;
      for(var x in digit)
      {
          if(digit[x] == 1) {
          context.setSourceRGB(1,1,1);
          context.arc(radius + arcwidth * 3+ spacing+ spacing+ spacing, i*archeight + radius, radius, 0, 4 * Math.PI);
          context.fill();
          context.setSourceRGB(.6,.6,.6);
          }
          else {
            context.arc(radius + arcwidth * 3+ spacing+ spacing+ spacing, i*archeight + radius, radius, 0, 4 * Math.PI);
            context.fill();
          }
          i++;
      }
      
      
      if(displaySeconds) 
      {
         digit = _getBinary(parseInt(_doubleDigitTime(strSeconds).charAt(0)));
         i = 0;
          for(var x in digit)
          {
              if(digit[x] == 1) {
              context.setSourceRGB(1,1,1);
              context.arc(radius + arcwidth * 4+ spacing+ spacing+ spacing+ spacing, (i*archeight) + radius, radius, 0, 4 * Math.PI);
              context.fill();
              context.setSourceRGB(.6,.6,.6);
              }
              else {
                context.arc(radius + arcwidth * 4+ spacing+ spacing+ spacing+ spacing, (i*archeight) + radius, radius, 0, 4 * Math.PI);
                context.fill();
              }
              i++;
          }
        
        digit = _getBinary(parseInt(_doubleDigitTime(strSeconds).charAt(1)));
        i = 0;
        for(var x in digit)
        {
            if(digit[x] == 1) {
            context.setSourceRGB(1,1,1);
            context.arc(radius + arcwidth * 5+ spacing+ spacing+ spacing+ spacing+ spacing, (i * archeight) + radius, radius, 0, 4 * Math.PI);
            context.fill();
            context.setSourceRGB(.6,.6,.6);
            }
            else {
              context.arc(radius + arcwidth * 5+ spacing+ spacing+ spacing+ spacing+ spacing, (i * archeight) + radius, radius, 0, 4 * Math.PI);
              context.fill();
            }
            i++;
        }
      }
      context.$dispose();
}


function init() {
}


function enable() {
    dateMenu = Main.panel.statusArea['dateMenu'];
    if (!dateMenu) {
        log('No dateMenu panel element defined.');
        return;
    }
    let desktop_settings = new Gio.Settings({ schema: "org.gnome.desktop.interface" });
    displaySeconds = desktop_settings.get_boolean('clock-show-seconds');
    //todo: add a boxlayout to this button, and add the date AND the binarycalc drawingarea to that later, so date also shows up.
    button = new St.Bin({     
                          width: 80,
                          height: 20,
                        });
    
    boxlayout = new St.BoxLayout();
    
                        
    binaryCalc = new St.DrawingArea({ 
                                      width: 80,
                                      height: 32,
                                    });
                                    
    button.set_child(binaryCalc);
    testlabel = St.Label.new("ex:\t\t");
    boxlayout.add(testlabel);
    boxlayout.add(button);
    repaintConnection = binaryCalc.connect('repaint',_repaintevent);
    //Main.panel._rightBox.insert_child_at_index(button, 0);
    Main.panel.statusArea['dateMenu'].insert_child_at_index(boxlayout, 0); //to put in middle 

    if (updateClockId != 0) {
        dateMenu._clock.disconnect(updateClockId);
    }

    updateClockId = dateMenu._clock.connect('notify::clock', Lang.bind(dateMenu, _triggerRepaint));
    //updateClockDisplayId = dateMenu._clockDDisplayconnect('notify::clock', Lang.bind(dateMenu. _triggerRepaint));
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

    /*if (updateClockDisplayId != 0) {
        dateMenu._clockDisplay.disconnect(updateClockDisplayId);
        updateClockDisplayId = 0;
    }    */
    if(repaintConnection != 0) {
        binaryCalc.disconnect(repaintConnection);
        repaintConnection = 0;
    }
}
