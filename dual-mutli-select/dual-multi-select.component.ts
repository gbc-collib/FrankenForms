import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/*
    * This component implements the ControlValueAccessor interface
    * This allows angular FormGroup to treat it like a native dom input
    *  This means in other components we can simplify our use of it
    *  But it is also completely optional and you can still manually
    *  subscribe to the selectedItemsChange event
 */
interface IItem {
    id: string;
    name: string;
}
@Component({
    selector: 'dual-multi-select',
    templateUrl: './dual-multiselect.component.html',
    styleUrl: './dual-multiselect.component.scss'

})
export class DualMultiSelectComponent implements OnChanges, ControlValueAccessor {
    @Input() options: any; // Define the input for options data
    @Output() selectedItemsChange = new EventEmitter<any[]>(); // Define output for selected items changes
    public searchTerm: string = '';
    selectedItems: any[] = []; // Array to store selected items
    public addItem: string = '';
    items: any[] = [];
    public onChange: Function;
    public onTouched: Function;

    ngOnChanges(): void {
        // Update selected items based on initial options
        if (this.options && this.options.selectedItems) {
            this.selectedItems = this.options.selectedItems;
            this.items = this.options.items;
        }
    }

    //Function helps angular with change detection because our array is full of objects it can get little funky
    //Look at html and our ngFor loops for more context
    trackBy(index: number, item: IItem): string {
        return item.id;
    }

    // Function to transfer items between lists
    transfer(fromList: any[], toList: any[], index: number): void {
        this.onTouched(); // Mark the component as touched
        if (index > 0) {
            toList.push(fromList[index]);
            fromList.splice(index, 1);
        } else if (index == 0) {
            toList.push(fromList.splice(index, 1)[0]); // Move and remove item
        } else {
            fromList.forEach(item => toList.push(item));
            fromList.length = 0;
        }
        this.onChange(this.selectedItems); // Notify the form control of the change
        this.selectedItemsChange.emit(this.selectedItems); // Let parent know, Emit selected items change event
    }

    addToSelected(item: string, event?): void {
        if (event) event.preventDefault();
        this.onTouched(); // Mark the component as touched
        this.selectedItems.push({
            id: this.selectedItems.length,
            name: item
        });
        this.selectedItemsChange.emit(this.selectedItems); // Let parent know, Emit selected items change event
        this.onChange(this.selectedItems); // Notify the form control of the change
        this.addItem = '';
    }

    //Reactive forms API interface methods:
    writeValue(obj: any): void {
        this.selectedItems = obj as any[];
    };

    registerOnChange(fn: any): void {
        this.onChange = fn;

    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}

