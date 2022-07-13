import { Component, ViewChild } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventAddArg,
  EventChangeArg,
  FullCalendarComponent
} from '@fullcalendar/angular';
import { createEventId } from './event-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(FullCalendarComponent) calendarComponent: FullCalendarComponent | undefined;

  calendarVisible = true;

  calendarOptions: CalendarOptions = {
    events: this.generateEvents(),
    initialView: 'timeGridDay',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),

    eventAdd: this.handleAddEvent.bind(this),
    eventChange: this.handleChangeEvent.bind(this)
  };

  generateEvents() {
    return [
      {
        id: '123',
        title: 'Event title',
        start: new Date().toISOString(),
        end: new Date().toISOString(),
      }
    ]
  }

  handleChangeEvent(event: EventChangeArg) {
    console.log('handleChangeEvent', event)
    // Fake: Backend sends events back to frontend
    setTimeout(() => {
      this.calendarOptions.events = JSON.parse(JSON.stringify([
        ...this.generateEvents()
      ]));
      console.log('Backend updates events', this.calendarOptions.events)
      console.log('Fullcalendar API Events', this.calendarComponent?.getApi().getEvents().map(it => it.id));

      this.calendarComponent?.getApi().refetchEvents();
      console.log('Refetch events')
      this.calendarComponent?.getApi().render()
      console.log('Render')
    }, 1000);
  }

  handleAddEvent(event: EventAddArg) {
    console.log('ADD EVENT', event);
    console.log('Fullcalendar API Events', this.calendarComponent?.getApi().getEvents().map(it => it.id))
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }
}
