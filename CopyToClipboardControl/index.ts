import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as clipboard from "clipboard";

export class CopyToClipboardControl
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _value: string;
  private _notifyOutputChanged: () => void;
  private labelElement: HTMLLabelElement;
  private textInput: any;
  private button: HTMLButtonElement;
  private _container: HTMLDivElement;
  private _rootContainer: HTMLDivElement;
  private _context: ComponentFramework.Context<IInputs>;
  private _refreshData: EventListenerOrEventListenerObject;

  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._context = context;
    this._container = document.createElement("div");
    this._notifyOutputChanged = notifyOutputChanged;

    this.textInput = document.createElement("label");
    this.textInput.setAttribute("type", "text");
    this.textInput.addEventListener("input", this._refreshData);
    this._container.appendChild(this.textInput);

    this.button = document.createElement("button");
    this.button.innerHTML = context.resources.getString(
      "CoptToClipboardControl_ButtonLabel"
    );
    this.button.addEventListener("click", this.onButtonClick.bind(this));
    this.textInput.addEventListener("change", this.onInputBlur.bind(this));
    this._container.appendChild(this.button);
    container.appendChild(this._container);
  }

  /**
   * Button Event handler for the button created as part of this control
   * @param event
   */
  private onButtonClick(event: Event): void {
    this._notifyOutputChanged();
    // Add copy logic
    clipboard.copy(this._value.toString());
  }
  /**
   * Input Blur Event handler for the input created as part of this control
   * @param event
   */
  private onInputBlur(event: Event): void {
    this._value = this.textInput.value;
    this._notifyOutputChanged();
  }
  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void {
    // Add code to update control view
    this._value = context.parameters.Value.raw!;
    let tempValue = this._value != null ? this._value.toString() : "";

    this.textInput.value = tempValue;

    if (context.parameters.Value.error) {
      this.textInput.classList.add("CopyText_Input_Error_Style");
    } else {
      this.textInput.classList.remove("CopyText_Input_Error_Style");
    }

    // refresh input size
    this.textInput.style.height = this._rootContainer.style.height;

    // might get the width/height as below in the future
    //context.accessibility._customControlProperties.parentDefinedControlProps.width
    //context.accessibility._customControlProperties.parentDefinedControlProps.height

    this.configureInputProperties(this.textInput, context.parameters);
    this.configureButtonProperties(this.button, context.parameters);
  }
  private configureInputProperties(input: any, parameters: IInputs) {
    input.placeholder = parameters.Placeholder.raw!;
    input.maxLength =
      parameters.MaxLength.raw || (input.tagName === "input" ? 255 : 500);
    input.readOnly = parameters.ReadOnly.raw;

    input.classList.add("CopyText_Input_Style");

    input.style.color = parameters.InputColor.raw!;
    input.style.fontSize = parameters.InputFontSize.raw + "pt";
    input.style.fontWeight = parameters.InputFontWeight.raw!;
    input.style.fontFamily = parameters.InputFontFamily.raw!;
    input.style.borderWidth = parameters.InputBorderThickness.raw + "px";
    input.style.borderRadius = parameters.InputBorderRadius.raw + "px";
    input.style.borderColor = parameters.InputBorderColor.raw!;
    input.style.backgroundColor = parameters.InputBackgroundColor.raw!;
  }

  private configureButtonProperties(
    button: HTMLButtonElement,
    parameters: IInputs
  ) {
    button.classList.add("CopyText_Button_Style");

    button.style.color = parameters.ButtonColor.raw!;
    button.style.fontSize = parameters.ButtonFontSize.raw + "pt";
    button.style.fontWeight = parameters.ButtonFontWeight.raw!;
    button.style.fontFamily = parameters.ButtonFontFamily.raw!;
    button.style.borderWidth = parameters.ButtonBorderThickness.raw + "px";
    button.style.borderRadius = parameters.ButtonBorderRadius.raw + "px";
    button.style.borderColor = parameters.ButtonBorderColor.raw!;
    button.style.backgroundColor = parameters.ButtonBackgroundColor.raw!;
  }

  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as ???bound??? or ???output???
   */
  public getOutputs(): IOutputs {
    return {};
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
