import St from 'gi://St';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';

export default class Extension {
    constructor() {
        this.button = null;
        this.binaryCalc = null;
        this.dateMenu = null;
        this.updateClockId = null;
    }

    /**
     * Draws a single binary digit on the screen.
     *
     * @param {object} context - The context used for drawing.
     * @param {number} startX - The starting X position for drawing the digit.
     * @param {number} startY - The starting Y position for drawing the digit.
     * @param {string} digitChar - The character (digit) to draw in binary.
     * @param {number} radius - The radius of the circles representing binary bits.
     * @param {number} arcWidth - The width of each arc, used for spacing calculations.
     * @param {number} arcHeight - The height of each arc, impacts vertical spacing.
     * @param {number} spacing - The horizontal spacing between arcs.
     */
    _drawBinaryDigit(context, startX, startY, digitChar, radius, arcWidth, arcHeight, spacing) {
        // Convert the single digit to its binary representation, padded to 4 bits.
        let binaryRepresentation = this._getBinary(parseInt(digitChar));

        // Iterate over the binary representation.
        let bitIndex = 0; // Track the bit's position for vertical placement.
        for (let bit of [binaryRepresentation.eight, binaryRepresentation.four, binaryRepresentation.two, binaryRepresentation.one]) {
            // Set drawing color based on bit value (1: white, 0: grey).
            context.setSourceRGB(bit === '1' ? 1 : 0.6, bit === '1' ? 1 : 0.6, bit === '1' ? 1 : 0.6);

            // Draw the circle for the current bit.
            context.arc(startX, startY + bitIndex * arcHeight + radius, radius, 0, 2 * Math.PI);
            context.fill();

            bitIndex++; // Move to the next vertical position for the following bit.
        }
    }

    _triggerRepaint() {
        this.binaryCalc.queue_repaint();
    }

    /* returns the binary representation of a number */
    _getBinary(num) {
        const bin = num.toString(2).padStart(4, '0');
        return {
            eight: bin[0],
            four: bin[1],
            two: bin[2],
            one: bin[3]
        };
    }

    /**
     * Handles the repainting of the binary clock, drawing each digit of the current time in binary form.
     *
     * @param {object} stdrawingarea - The St.DrawingArea widget used for custom drawing.
     * @param {object} user_data - Additional user data passed to the callback, not used here.
     */
    _repaintevent(stdrawingarea, user_data) {
        // Get the current time in the correct timezone.
        let tz = this.dateMenu._clock.get_timezone();
        let date = GLib.DateTime.new_now(tz);
        let strHour = date.get_hour().toString();
        let strMinute = date.get_minute().toString();
        let strSeconds = date.get_second().toString();

        // Prepare the drawing context and dimensions.
        let context = stdrawingarea.get_context();
        let [width, height] = stdrawingarea.get_surface_size();

        // Define drawing parameters.
        let arcWidth = height / 4;
        let arcHeight = arcWidth;
        let radius = arcWidth / 2;
        let spacing = 5;

        // Draw each part of the time.
        // Hours: tens place
        this._drawBinaryDigit(context, radius, 0, strHour.padStart(2, '0').charAt(0), radius, arcWidth, arcHeight, spacing);
        // Hours: ones place - Increase the `startX` position to account for the previous digit and spacing.
        this._drawBinaryDigit(context, radius * 3 + spacing, 0, strHour.padStart(2, '0').charAt(1), radius, arcWidth, arcHeight, spacing);

        // Minutes: tens place - Further increase the `startX` position similarly.
        this._drawBinaryDigit(context, radius * 5 + spacing * 2, 0, strMinute.padStart(2, '0').charAt(0), radius, arcWidth, arcHeight, spacing);
        // Minutes: ones place
        this._drawBinaryDigit(context, radius * 7 + spacing * 3, 0, strMinute.padStart(2, '0').charAt(1), radius, arcWidth, arcHeight, spacing);

        // Optionally draw seconds if enabled, continuing to increase `startX` position.
        if (this.displaySeconds) {
            // Seconds: tens place
            this._drawBinaryDigit(context, radius * 9 + spacing * 4, 0, strSeconds.padStart(2, '0').charAt(0), radius, arcWidth, arcHeight, spacing);
            // Seconds: ones place
            this._drawBinaryDigit(context, radius * 11 + spacing * 5, 0, strSeconds.padStart(2, '0').charAt(1), radius, arcWidth, arcHeight, spacing);
        }

        // Clean up the context once drawing is complete.
        context.$dispose();
    }

    init() {
    }

    enable() {
        this.dateMenu = Main.panel.statusArea['dateMenu'];
        if (!this.dateMenu) {
            log('gBinaryClock: No dateMenu panel element defined.');
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

        if (this.updateClockId !== 0) {
            this.dateMenu._clock.disconnect(this.updateClockId);
            this.updateClockId = 0;
        }

        if (this.repaintConnection !== 0) {
            this.binaryCalc.disconnect(this.repaintConnection);
            this.repaintConnection = 0;
        }

        this.button = null;
        this.binaryCalc = null;
        this.dateMenu = null;
        this.updateClockId = null;
    }
}
