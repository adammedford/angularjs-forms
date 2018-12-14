/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {
  Directive,
  EventEmitter,
  Host,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  Self,
  SimpleChanges,
  SkipSelf,
  forwardRef
} from 'ng-metadata/core'

import { FormControl } from '../../model'
import { NG_ASYNC_VALIDATORS, NG_VALIDATORS } from '../../validators'
import { AbstractFormGroupDirective } from '../abstract_form_group_directive'
import { ControlContainer } from '../control_container'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '../control_value_accessor'
import { NgControl } from '../ng_control'
import { ReactiveErrors } from '../reactive_errors'
import {
  _ngModelWarning,
  composeAsyncValidators,
  composeValidators,
  controlPath,
  isPropertyUpdated,
  selectValueAccessor
} from '../shared'
import { AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn } from '../validators'

import { FormGroupDirective } from './form_group_directive'
import { FormArrayName, FormGroupName } from './form_group_name'

export const controlNameBinding: any = {
  provide: NgControl,
  useExisting: forwardRef(() => FormControlName)
}

/**
 * @description
 * Syncs a `FormControl` in an existing `FormGroup` to a form control
 * element by name.
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 * @see `FormControl`
 * @see `AbstractControl`
 *
 * @usageNotes
 *
 * ### Register `FormControl` within a group
 *
 * The following example shows how to register multiple form controls within a form group
 * and set their value.
 *
 * {@example forms/ts/simpleFormGroup/simple_form_group_example.ts region='Component'}
 *
 * @ngModule ReactiveFormsModule
 * @publicApi
 */
@Directive({ selector: '[formControlName]', providers: [controlNameBinding] })
export class FormControlName extends NgControl implements OnChanges, OnDestroy {
  private _added = false
  /**
   * @description
   * Internal reference to the view model value.
   * @internal
   */
  viewModel: any

  /**
   * @description
   * Tracks the `FormControl` instance bound to the directive.
   */
  // TODO(issue/24571): remove '!'.
  readonly control!: FormControl

  /**
   * @description
   * Tracks the name of the `FormControl` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   */
  // TODO(issue/24571): remove '!'.
  @Input('formControlName') name!: string

  /**
   * @description
   * Triggers a warning that this input should not be used with reactive forms.
   */
  @Input('disabled')
  set isDisabled(isDisabled: boolean) {
    ReactiveErrors.disabledAttrWarning()
  }

  model: any
  @Output('ngModelChange') update = new EventEmitter()

  constructor(
    @Optional() @Host() @SkipSelf() parent: ControlContainer,
    @Optional() @Self() @Inject(NG_VALIDATORS) validators: Array<Validator | ValidatorFn>,
    @Optional()
    @Self()
    @Inject(NG_ASYNC_VALIDATORS)
    asyncValidators: Array<AsyncValidator | AsyncValidatorFn>,
    @Optional() @Self() @Inject(NG_VALUE_ACCESSOR) valueAccessors: ControlValueAccessor[]
  ) {
    super()
    this._parent = parent
    this._rawValidators = validators || []
    this._rawAsyncValidators = asyncValidators || []
    this.valueAccessor = selectValueAccessor(this, valueAccessors)
  }

  /**
   * @description
   * A lifecycle method called when the directive's inputs change. For internal use only.
   *
   * @param changes A object of key/value pairs for the set of changed inputs.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!this._added) this._setUpControl()
    if (isPropertyUpdated(changes, this.viewModel)) {
      this.viewModel = this.model
      this.formDirective.updateModel(this, this.model)
    }
  }

  /**
   * @description
   * Lifecycle method called before the directive's instance is destroyed. For internal use only.
   */
  ngOnDestroy(): void {
    if (this.formDirective) {
      this.formDirective.removeControl(this)
    }
  }

  /**
   * @description
   * Sets the new value for the view model and emits an `ngModelChange` event.
   *
   * @param newValue The new value for the view model.
   */
  viewToModelUpdate(newValue: any): void {
    this.viewModel = newValue
    this.update.emit(newValue)
  }

  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path(): string[] {
    return controlPath(this.name, this._parent!)
  }

  /**
   * @description
   * The top-level directive for this group if present, otherwise null.
   */
  get formDirective(): any {
    return this._parent ? this._parent.formDirective : null
  }

  /**
   * @description
   * Synchronous validator function composed of all the synchronous validators
   * registered with this directive.
   */
  get validator(): ValidatorFn | null {
    return composeValidators(this._rawValidators)
  }

  /**
   * @description
   * Async validator function composed of all the async validators registered with this
   * directive.
   */
  get asyncValidator(): AsyncValidatorFn {
    return composeAsyncValidators(this._rawAsyncValidators)!
  }

  private _checkParentType(): void {
    if (
      !(this._parent instanceof FormGroupName) &&
      this._parent instanceof AbstractFormGroupDirective
    ) {
      ReactiveErrors.ngModelGroupException()
    } else if (
      !(this._parent instanceof FormGroupName) &&
      !(this._parent instanceof FormGroupDirective) &&
      !(this._parent instanceof FormArrayName)
    ) {
      ReactiveErrors.controlParentException()
    }
  }

  private _setUpControl() {
    this._checkParentType()
    ;(this as { control: FormControl }).control = this.formDirective.addControl(this)
    if (this.control.disabled && this.valueAccessor!.setDisabledState) {
      this.valueAccessor!.setDisabledState!(true)
    }
    this._added = true
  }
}
