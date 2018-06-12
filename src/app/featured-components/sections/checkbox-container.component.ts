import { Component, OnInit } from '@angular/core';

@Component({
template: `
  <div class="component-section">
    <div class="component-section__header">
      Checkbox Container
    </div>
    <div class="component-section__description">
      <p>
        This component is primary responsible for keeping request generation clean and minimal,
        providing only relevant inputs.
        Initial screen is kept minimal with additonal response options provided as selections are made.
      </p>

      <format-code
        content='
          <container-chb title="Container title">
            Container content visible only when title selected. Content can be
            text or composition of additional inputs
            <container-chb title="Secondary input">
              Secondary input content.
            </container-chb>
          </container-chb>
        '>
        <container-chb title="Container title">
          Container content visible only when title selected
          <container-chb title="Secondary input">Secondary input content</container-chb>
        </container-chb>
      </format-code>
      <div class="component-section__subheader">
        Component input parameters:
      </div>
      <ul>
        <li>title</li>
        <li>subtitle</li>
        <li>radioSelectChild
          <p>
            radioSelectChild paramater sets up UI following radio select pattern
            with addition of hiding unselected siblings to keep tidy and minimize
            visible inputs that after selection is made becomes visual noise
          </p>
          <format-code
            content='
              <container-chb radioSelectChild>
                <container-chb title="01 of 3"></container-chb>
                <container-chb title="02 of 3"></container-chb>
                <container-chb title="03 of 3"></container-chb>
              </container-chb>
            '>
            <container-chb radioSelectChild>
              <container-chb title="01 of 3"></container-chb>
              <container-chb title="02 of 3"></container-chb>
              <container-chb title="03 of 3"></container-chb>
            </container-chb>
          </format-code>
        </li>
      </ul>
    </div>
  </div>
`
})
export class CheckboxContainerComponent { }
