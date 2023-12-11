import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxLength]',
})
export class MaxLengthDirective {
  @Input() maxLength: number;
  inputElement: HTMLInputElement;
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];
  constructor(private el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const allowedKeysWithCtrl = ['a', 'c', 'v', 'x'];

    if (
      this.navigationKeys.indexOf(e.key) > -1                        // Allow: navigation keys: backspace, delete, arrows etc.
      || (e.ctrlKey === true && allowedKeysWithCtrl.includes(e.key)) // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      || (e.metaKey === true && allowedKeysWithCtrl.includes(e.key)) // Allow: Cmd+A, Cmd+C, Cmd+V, Cmd+X
    ) {
      // let it happen, don't do anything
      return;
    }

    if (this.el.nativeElement.value.length >= this.maxLength) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    if (event.clipboardData) {
      const pastedInput: string = event.clipboardData
        .getData('text/plain')
        .replace(/[^0-9\s!?]/g, '');
      this.inputElement.value = pastedInput.substring(0, 3);
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const textData = event.dataTransfer
        .getData('text')
        .replace(/[^0-9\s!?]/g, '');
      this.inputElement.focus();
      this.inputElement.value = textData.substring(0, 3);
    }
  }
}
