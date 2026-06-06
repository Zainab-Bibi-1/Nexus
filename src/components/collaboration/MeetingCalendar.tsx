import React, { useState } from 'react';
import { VideoCallModal } from './VideoCallModal';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export const MeetingCalendar: React.FC = () => {
  // --- States ---
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState("");
  
  // Dynamic Events State: Is se calendar static nahi rahega
  const [myEvents, setMyEvents] = useState([
    { title: 'Investor Meeting', start: '2026-03-28', backgroundColor: '#4f46e5', allDay: true },
    { title: 'Demo Day', start: '2026-04-10', backgroundColor: '#10b981', allDay: true }
  ]);

  // --- Logic for Scheduling New Meeting ---
  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Schedule New Meeting - Enter Title:');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // Selection clear karne ke liye

    if (title) {
      const newEvent = {
        id: String(Date.now()), // Unique ID for each event
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        backgroundColor: '#6366f1' // Default color for new meetings
      };
      
      setMyEvents([...myEvents, newEvent]);
      alert(`Meeting "${title}" has been added to your schedule!`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 meeting-calendar-container">
      
      {/* Video Call Modal */}
      <VideoCallModal 
        isOpen={callModalOpen} 
        onClose={() => setCallModalOpen(false)} 
        meetingTitle={selectedMeeting} 
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Meeting Schedule</h2>
        <span className="px-3 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-full">
          Week 2: Functional Booking
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .fc .fc-button-primary {
          background-color: #4f46e5 !important;
          border-color: #4f46e5 !important;
          border-radius: 8px;
          font-weight: 500;
        }
        .fc .fc-button-primary:hover {
          background-color: #4338ca !important;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 700 !important;
        }
        .fc th {
          background-color: #f9fafb;
          padding: 10px 0 !important;
          color: #4b5563 !important;
          font-size: 0.75rem;
        }
        .fc .fc-daygrid-day.fc-day-today {
          background-color: #f5f3ff !important;
        }
        .fc .fc-event {
          border-radius: 6px;
          padding: 4px 6px;
          font-size: 0.8rem;
          cursor: pointer;
          border: none;
          margin-bottom: 2px;
        }
      `}} />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        height="auto"
        selectable={true}
        editable={true}
        selectMirror={true}
        dayMaxEvents={true}
        
        // --- 1. Selection Logic (Add Meeting) ---
        select={handleDateSelect}

        // --- 2. Click Logic (Start Video Call) ---
        eventClick={(info) => {
          setSelectedMeeting(info.event.title);
          setCallModalOpen(true);
        }}

        // --- 3. Data Source ---
        events={myEvents}
      />
    </div>
  );
};