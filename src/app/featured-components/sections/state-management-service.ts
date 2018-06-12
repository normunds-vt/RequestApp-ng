
import { Component } from '@angular/core';

@Component({
  template: `
  <div class="component-section">
    <div class="component-section__header">
    Request App State Management
    </div>
    <div class="component-section__description">
      <div>
        State management is responsible for:
      </div>
      <ul style="line-height: 2">
        <li>
          Determining if form is in valid submission state and enabling submit button.  Form state is
          valid if there are no visible items that are required without provided response.
          In practice it means traversing visible part of form tree to determine state of form.
          Submission button state is responding to state of form provided by service stream.
        </li>
        <li>
          Service is also generating request content as text so it can be used in email or other text based
          communication. Content generation is similar to state determination and requires traversing visible
          part of the form.
        </li>
        <li>
          The service also lists, allows viewing and editing previously submitted requests with help of
          local or remote storage services.
        </li>
      </ul>

      The service discovers the form configurations state tree at applications startup time based on provided
      form component configuration. Service recives state updates from each component and determines overall forms
      state status. When service receives request to restore pereviously submitted request state it communicates back
      to individual components their local state that needs to be restored.
  </div>
`})
export class StateManagementServiceComponent { }
