/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { NgModule } from 'ng-metadata/core'

import {
  InternalFormsSharedModule,
  REACTIVE_DRIVEN_DIRECTIVES,
  TEMPLATE_DRIVEN_DIRECTIVES
} from './directives'
import { RadioControlRegistry } from './directives/radio_control_value_accessor'
import { FormBuilder } from './form_builder'

/**
 * Exports the required providers and directives for template-driven forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/forms)
 *
 * @see [Forms Guide](/guide/forms)
 *
 * @publicApi
 */
@NgModule({
  declarations: TEMPLATE_DRIVEN_DIRECTIVES,
  providers: [RadioControlRegistry],
  exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
})
export class FormsModule {}

/**
 * Exports the required infrastructure and directives for reactive forms,
 * making them available for import by NgModules that import this module.
 * @see [Forms](guide/reactive-forms)
 *
 * @see [Reactive Forms Guide](/guide/reactive-forms)
 *
 * @publicApi
 */
@NgModule({
  declarations: [REACTIVE_DRIVEN_DIRECTIVES],
  providers: [FormBuilder, RadioControlRegistry],
  exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
})
export class ReactiveFormsModule {}
