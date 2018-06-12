import { Component } from '@angular/core';

@Component({
  template: `
  <div class="component-section">
    <div class="component-section__header">
      Request App container.
    </div>
    <div class="component-section__description">
      <p>
        Request App is implementation of an interface that minimizes information overload of complex forms.
        It allows users to concentrate only on the relevant options made available in response to previous entries.
        Providing only relevant options is helping to reduce percieved request complexity.
        <br><br>
        This approach shares guidance aspects of wizzard interface pattern with
        an addition of maintaining context of previously provided responses and ability of non-sequential
        content completion and editing.
        <br><br>
        Request content summary is generated at request submission time and is used
        in text based content correspondence for example emails or other type of notifications.
      </p>

      1. Initial screen provides simple choice.
      <figure>
        <img src="assets/read_me_images/01_initial_selection.png" alt="Inital screen">
      </figure>
      <br>

      2. Once an item is selected it reveals choices and requirements available for it.
      Red line on left of subselections indicating that at least one choice needs to be made.
      <figure>
        <img src="assets/read_me_images/02_item_selected.png" alt="Selected item state">
      </figure>
  </div>
`})
export class RequestGeneratorComponent { }
