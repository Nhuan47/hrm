import React, { memo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import "../../styles/calendar-style.css";

export const Calendar = memo(({ timeOff, holidays }) => {
  if (holidays && timeOff) {
    return (
      <FullCalendar
        initialView="dayGridMonth"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          googleCalendarPlugin,
        ]}
        headerToolbar={{
          center: "",
          left: "title",
          right: "prev,next today",
        }}
        events={[...timeOff, ...holidays]}
        dayMaxEventRows={5}
        eventMouseEnter={function (arg) {
          arg.el.title = arg.event._def.title;
        }}
      />
    );
  }
});
