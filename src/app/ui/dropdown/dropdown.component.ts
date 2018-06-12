import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';

@Component({
  selector: 'vt-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() list: string [] = [];
  @Input() isWide = false;

  @Input() placeholderLabel: string;

  @Input()
    set select(value: string) {
      this._selectedItem = removeLength(value, this.isWide);

      let item = value;
      if (this.isWide) {
        item = this.list.find((el) =>
          removeLength(el, this.isWide) === removeLength(value, this.isWide)
        );
      }

      this._fullSelectedItem = item;
    }

  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('dropdown') dropdown;

  _selectedItem: string;
  _fullSelectedItem: string;
  dropdownVisible = false;

  showDropdown() {
    this.dropdownVisible = true;
    scollToItem(this.dropdown.nativeElement, this.list.indexOf(this._fullSelectedItem));
  }

  hideDropdown() { this.dropdownVisible = false; }

  selectItem(item) {
    this._fullSelectedItem = item;
    this._selectedItem = item.replace(/ \(.*/, '');  // remove time slot length
    this.selected.emit(this._selectedItem);
  }

  moveselection(direction: number) {
    const currentIndex = this.list.indexOf(this._fullSelectedItem);

    if (
      (direction > 0 && currentIndex === this.list.length - 1) ||
      (direction < 0 && currentIndex <= 0)
    ) {
      // TODO: add toast informing cannot move
      // console.log('cannot move', currentIndex, direction)
      return;
    } else if (direction === 0) {
      this.selectItem('');
      return;
    }
    const newIndex = currentIndex + direction;
    // this._fullSelectedItem = this.list[newIndex];
    // this._selectedItem = removeLength(this._fullSelectedItem, this.isWide);
    scollToItem(this.dropdown.nativeElement, newIndex);
    this.selectItem(this.list[newIndex]);

  }

  keyEvent(e) {
    switch (e.code) {
      case 'ArrowUp': return this.moveselection(-1);
      case 'ArrowDown': return this.moveselection(1);
      case 'Backspace': return this.moveselection(0);
      case 'Enter':
      case 'Space': return this.hideDropdown();
    }
  }
}

function removeLength(value: string, isWide: boolean) {
  return value && isWide ? value.replace(/ \(.*/, '') : value;
}


// scroll list to desired item in scrollabele container
function scollToItem(container, childNumber /*, cb = function() {}*/ ) {
  const elCount = container.children.length;

  const targetPos = Math.min(
    container.scrollHeight - container.clientHeight, //  total amount scrollable for this element
    container.scrollHeight / elCount * childNumber // desired position of element on top of list
  );
  childNumber = Math.max(childNumber, elCount);
  let start = container.scrollTop;
  const incrementer = 0.01;

  if (container.timer) {
    clearTimeout(container.timer);
    container.timer = null;
  }

  // start animation
  moveTo();

  // animation def
  function moveTo() {
    // if(!container)  return;  //  dom  node has  been deleted during animation
    start += (targetPos - start) * 0.1;

    container.scrollTop = start;

    if (Math.abs(targetPos - start)  > 1) { // if still making progress continue
      container.timer = setTimeout( moveTo, 20);
    } else {
      container.scrollTop = targetPos;
      container.timer = null;  //  indicate end of animation
    }
  // cb && cb();  }
  }
}
