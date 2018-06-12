import { Component, Input } from '@angular/core';

@Component({
  selector: 'format-code',
  template: `
  <div>
  <ng-content></ng-content>
  <div class="format-code">Code:
{{ _content }}
  </div>
</div>
  `,
  styles: [`
    .format-code {
      line-height: 1.4;
      white-space: pre;
      background: #f5f5f5;
      padding: 8px 16px 0px 0px;
      margin: 8px 0;
    }
  `],
})
export class FormatCodeComponent {
  _content = '';
  @Input() set content(value) {
    this._content = formatContent(value); // safe_tags(value);
  }
}

function formatContent(content: string) {
  const lines = content.split('\n');
  let preWhiteSpaceCount = 0;
  while (
    lines[1].charAt(preWhiteSpaceCount) === ' ' ||
    lines[1].charAt(preWhiteSpaceCount) === ' \t'
  ) {
    preWhiteSpaceCount++;
  }

  return content.split(/\n/)
    .slice(1, lines.length - 1)
    // .map(line => line.slice(preWhiteSpaceCount))
    .join('\n');
}
