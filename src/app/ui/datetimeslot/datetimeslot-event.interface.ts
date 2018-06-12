import { IDateTimeSlot } from './datetimeslot.interface';

export interface IDateTimeSlotEvent {
  value: IDateTimeSlot;
  isInternalEvent: boolean;
}
