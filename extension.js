/*
    Copyright 2020 Tjipke van der Heide
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export default class Extension {
    constructor() {
        this.button = null;
        this.bin = null;
        this.binaryCalc = null;
        this.dateMenu = null;
        this.updateClockId = null;
    }

    _triggerRepaint() {
        this.binaryCalc.queue_repaint();
    }

    /* makes sure the number gets a 0 prepended if it's only a single digit */
    _doubleDigitTime(num) {
        if (num.toString().length === 1) {
            return "0" + num.toString();
        } else {
            return num.toString();
        }
    }

    /* returns the binary representation of a number */
    _getBinary(num) {
        let bin = num.toString(2).padStart(4, '0');
        return {
            eight: bin[0],
            four: bin[1],
            two: bin[2],
            one: bin[3]
        };
    }

    /*This should happen on every clock update (and coincidentally on every gnome overview invocation */
    _repaintevent(stdrawingarea, user_data) {
        let tz = this.dateMenu._clock.get_timezone();
        let date = GLib.DateTime.new_now(tz);
        let strHour = date.get_hour();
        let strMinute = date.get_minute();
        let strSeconds = date.get_second();

        let context = stdrawingarea.get_context();
        let size = stdrawingarea.get_surface_size();
        let width = size[0];
        let height = size[1];

        let arcwidth = height / 4;
        let archeight = arcwidth;
        let radius = arcwidth / 2;
        let spacing = 5;
        context.setSourceRGB(.6, .6, .6);

        let digit = this._getBinary(parseInt(this._doubleDigitTime(strHour).charAt(0)));
        var i = 0;
        for (var x in digit) {
            if (digit[x] == 1) {
                context.setSourceRGB(1, 1, 1);
                context.arc(radius, i * archeight + radius, radius, 0, 4 * Math.PI);
                context.fill();
                context.setSourceRGB(.6, .6, .6);
            } else {
                context.arc(radius, i * archeight + radius, radius, 0, 4 * Math.PI);
                context.fill();
            }
            i++;
        }

        digit = this._getBinary(parseInt(this._doubleDigitTime(strHour).charAt(1)));
        i = 0;
        for (var x in digit) {
            if (digit[x] == 1) {
                context.setSourceRGB(1, 1, 1);
                context.arc(radius + arcwidth + spacing, i * archeight + radius, radius, 0, 4 * Math.PI);
                context.fill();
                context.setSourceRGB(.6, .6, .6);
            } else {
                context.arc(radius + arcwidth + spacing, i * archeight + radius, radius, 0, 4 * Math.PI);
                context.fill();
            }
            i++;
        }

        digit = this._getBinary(parseInt(this._doubleDigitTime(strMinute).charAt(0)));
        i = 0;
        for (var x in digit) {
            if (digit[x] == 1) {
                context.setSourceRGB(1, 1, 1);
                context.arc(radius + arcwidth * 2 + spacing + spacing, i * archeight + radius, radius, 0, 4 * Math.PI);
                context.fill();
                context.setSourceRGB(.6, .6, .6);
            } else {
                context.arc(radius + arcwidth * 2 + spacing + spacing, i * archeight + radius, radius, 0, 4 * Math.PI);
                context.fill();
            }
            i++;
        }


        digit = this._getBinary(parseInt(this._doubleDigitTime(strMinute).charAt(1)));
        i = 0;
        for (var x in digit) {
            if (digit[x] == 1) {
                context.setSourceRGB(1, 1, 1);
                context.arc(radius + arcwidth * 3 + spacing + spacing + spacing, i * archeight + radius, radius, 0, 4 * Math.PI);
                context.fill();
                context.setSourceRGB(.6, .6, .6);
            } else {
                context.arc(radius + arcwidth * 3 + spacing + spacing + spacing, i * archeight + radius, radius, 0, 4 * Math.PI);
                context.fill();
            }
            i++;
        }


        if (this.displaySeconds) {
            digit = this._getBinary(parseInt(this._doubleDigitTime(strSeconds).charAt(0)));
            i = 0;
            for (var x in digit) {
                if (digit[x] == 1) {
                    context.setSourceRGB(1, 1, 1);
                    context.arc(radius + arcwidth * 4 + spacing + spacing + spacing + spacing, (i * archeight) + radius, radius, 0, 4 * Math.PI);
                    context.fill();
                    context.setSourceRGB(.6, .6, .6);
                } else {
                    context.arc(radius + arcwidth * 4 + spacing + spacing + spacing + spacing, (i * archeight) + radius, radius, 0, 4 * Math.PI);
                    context.fill();
                }
                i++;
            }

            digit = this._getBinary(parseInt(this._doubleDigitTime(strSeconds).charAt(1)));
            i = 0;
            for (var x in digit) {
                if (digit[x] == 1) {
                    context.setSourceRGB(1, 1, 1);
                    context.arc(radius + arcwidth * 5 + spacing + spacing + spacing + spacing + spacing, (i * archeight) + radius, radius, 0, 4 * Math.PI);
                    context.fill();
                    context.setSourceRGB(.6, .6, .6);
                } else {
                    context.arc(radius + arcwidth * 5 + spacing + spacing + spacing + spacing + spacing, (i * archeight) + radius, radius, 0, 4 * Math.PI);
                    context.fill();
                }
                i++;
            }
        }
        context.$dispose();
    }

    init() {
    }

    enable() {
        this.dateMenu = Main.panel.statusArea['dateMenu'];
        if (!this.dateMenu) {
            log('No dateMenu panel element defined.');
            return;
        }
        let desktop_settings = new Gio.Settings({
            schema: "org.gnome.desktop.interface"
        });
        this.displaySeconds = desktop_settings.get_boolean('clock-show-seconds');
        if (!this.button) {
            this.button = new St.Bin({
                width: 80,
                height: 20,
            });
        }
        if (!this.boxlayout) {
            this.boxlayout = new St.BoxLayout();
        }
        if (!this.binaryCalc) {
            this.binaryCalc = new St.DrawingArea({
                width: 80,
                height: 32,
            });
        }

        this.button.set_child(this.binaryCalc);
        this.boxlayout.add_child(this.button);
        this.repaintConnection = this.binaryCalc.connect('repaint', this._repaintevent.bind(this));
        if (!this.oldClock) {
            this.oldClock = Main.panel.statusArea['dateMenu'].get_child_at_index(0);
        }
        Main.panel.statusArea['dateMenu'].remove_child(this.oldClock);
        Main.panel.statusArea['dateMenu'].insert_child_at_index(this.boxlayout, 0);

        if (this.updateClockId !== 0) {
            this.dateMenu._clock.disconnect(this.updateClockId);
        }

        this.updateClockId = this.dateMenu._clock.connect('notify::clock', this._triggerRepaint.bind(this));
    }

    disable() {
        Main.panel.statusArea['dateMenu'].remove_child(this.boxlayout);
        Main.panel.statusArea['dateMenu'].insert_child_at_index(this.oldClock, 0);
        if (!this.dateMenu) {
            return;
        }

        if (this.updateClockId !== 0) {
            this.dateMenu._clock.disconnect(this.updateClockId);
            this.updateClockId = 0;
        }

        if (this.repaintConnection !== 0) {
            this.binaryCalc.disconnect(this.repaintConnection);
            this.repaintConnection = 0;
        }
    }
}

