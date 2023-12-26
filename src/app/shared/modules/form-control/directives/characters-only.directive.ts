import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCharactersOnly]',
})
export class CharactersOnlyDirective {
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
  inputElement: HTMLInputElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const allowedKeysWithCtrl = ['a', 'c', 'v', 'x'];

    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.ctrlKey === true && allowedKeysWithCtrl.includes(e.key)) || // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.metaKey === true && allowedKeysWithCtrl.includes(e.key)) // Allow: Cmd+A, Cmd+C, Cmd+V, Cmd+X
    ) {
      // let it happen, don't do anything
      return;
    }

    if (!(e.keyCode > 64 && e.keyCode < 91)) {
      e.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (event.clipboardData) {
      const pastedInput: string = event.clipboardData
        .getData('text/plain')
        .replace(/[^a-z\s!?]/gi, '');
      this.inputElement.value = pastedInput;
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    if (event.dataTransfer) {
      const textData = event.dataTransfer
        .getData('text')
        .replace(/[^a-z\s!?]/gi, '');
      this.inputElement.focus();
      this.inputElement.value = textData;
    }
  }
}
