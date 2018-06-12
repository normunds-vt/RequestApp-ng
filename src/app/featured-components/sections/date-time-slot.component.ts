import { Component } from '@angular/core';

@Component({
  template: `
  <div class="component-section">
    <div class="component-section__header">
      Data Time Slot component
    </div>
    <div class="component-section__description">
      <p>
        Data Time Slot component allows an precise and efficient way of scheduling resources
        such as conference rooms for time slots that are less then workdays length typically 1-3 hour long.
        <br>
        Selection of time is from predefined list of available time slots.  End time selections is guided with
        feedback of times slot length for selected end time and prevents selection of negative length by
        providing only valid end times based on selected start time.  Keeping lists to predefined slots reduces selection
        variations to ones that makes most sense for given resource.
      </p>

      <vt-datetimeslot
        date="10/12/2018"
        startTime="8:00 AM"
        endTime="6:30 PM"
        step="15"
        fromtime="9:00 AM"
        totime="4:00 PM"
      ></vt-datetimeslot>

      <format-code
        content='
        <vt-datetimeslot
          date="10/12/2018"
          startTime="8:00 AM"
          endTime="6:30 PM"
          fromtime="9:00 AM"
          totime="4:00 PM">
        </vt-datetimeslot>
        '></format-code>
    </div>
  </div>
`})
export class DateTimeSlotComponent { }
