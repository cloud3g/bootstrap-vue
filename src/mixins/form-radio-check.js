export default {
  data () {
    return {
      localChecked: this.bvGroup.checked,
      hasFocus: false,
      // Can never be a button when not in group (currently)
      // We use a data so we can easily test classes/structure
      buttons: false
    }
  },
  model: {
    prop: 'checked',
    event: 'input'
  },
  render (h) {
    const defaultSlot = this.$slots.default

    // Generate the input element
    const on = { change: this.handleChange }
    if (this.is_BtnMode) {
      // handlers for focus styling when in button mode
      on.focus = on.blur = this.handleFocus
    }
    const input = h(
      'input',
      {
        ref: 'input',
        key: 'input',
        on,
        class: {
          'form-check-input': this.is_Plain,
          'custom-control-input': this.is_Custom,
          'is-valid': this.get_State === true && !this.is_BtnMode,
          'is-invalid': this.get_State === false && !this.is_BtnMode
        },
        directives: [
          {
            name: 'model',
            rawName: 'v-model',
            value: this.computedLocalChecked,
            expression: 'computedLocalChecked'
          }
        ],
        attrs: {
          id: this.safeId(),
          type: this.is_Radio ? 'radio' : 'checkbox',
          name: this.get_Name,
          form: this.get_Form,
          disabled: this.is_Disabled,
          required: this.is_Required,
          autocomplete: 'off',
          'aria-required': this.is_Required || null
        },
        domProps: {
          value: this.value,
          checked: this.is_Checked
        }
      }
    )

    if (this.is_BtnMode) {
      // Button mode, requires wrapping in a radio-group
      return h(
        'label',
        { class: this.buttonClasses },
        [input, defaultSlot]
      )
    } else {
      // Not button mode
      const label = h(
        'label',
        {
          class: {
            'form-check-label': this.is_Plain,
            'custom-control-label': this.is_Custom
          },
          attrs: { for: this.safeId() }
        },
        defaultSlot
      )
      // Wrap it in a div
      return h(
        'div',
        {
          class: {
            'form-check': this.is_Plain,
            'form-check-inline': this.is_Plain && this.is_Inline,
            'custom-control': this.is_Custom,
            'custom-control-inline': this.is_Custom && this.is_Inline,
            'custom-checkbox': this.is_Custom && this.is_Check,
            'custom-radio': this.is_Custom && this.is_Radio,
            // Temprary until BS V4 supports sizing
            [`form-control-${this.get_Size}`]: Boolean(this.get_Size && !this.is_BtnMode)
          }
        },
        [input, label]
      )
    }
  },
  props: {
    value: {
    },
    checked: {
      // This is the model, except when in group mode
    },
    plain: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    buttonVariant: {
      // Only applicable when rendered with button style
      type: String,
      default: null
    }
  },
  watch: {
    checked (newVal, oldVal) {
      this.computedLocalChecked = newVal
    }
  },
  computed: {
    computedLocalChecked: {
      get () {
        return this.bvGroup.localChecked
      },
      set (val) {
        this.bvGroup.localChecked = val
      }
    },
    is_Group () {
      return this.bvGroup !== this
    },
    is_BtnMode () {
      return this.bvGroup.buttons || false
    },
    is_Plain () {
      return this.bvGroup.plain && !this.is_BtnMode
    },
    is_Custom () {
      return !this.bvGroup.plain && !this.is_BtnMode
    },
    is_Inline () {
      return this.bvGroup.inline && !this.is_BtnMode
    },
    is_Disabled () {
      // Child can be disabled while parent isn't, but is always
      // disabled if group is
      return this.bvGroup.disabled || this.disabled
    },
    is_Required () {
      // Required only works when a name is provided for the input(s)
      return Boolean(this.get_Name && this.bvGroup.required)
    },
    get_Name () {
      // Group name preferred over local name
      return this.bvGroup.groupName || this.name || null
    },
    get_Form () {
      return this.bvGroup.form || null
    },
    get_Size () {
      return this.bvGroup.size || ''
    },
    get_State () {
      // local state preferred over group state (except when null)
      if (typeof this.computedState === 'boolean') {
        return this.computedState
      } else if (typeof this.bvGroup.computedState === 'boolean') {
        return this.bvGroup.computedState
      } else {
        return null
      }
    },
    get_ButtonVariant () {
      // Local variant preferred over group variant
      return this.buttonVariant || this.bvGroup.buttonVariant || 'secondary'
    },
    buttonClasses () {
      // Same for radio & check
      return [
        'btn',
        `btn-${this.get_ButtonVariant}`,
        this.get_Size ? `btn-${this.get_Size}` : '',
        // 'disabled' class makes "button" look disabled
        this.is_Disabled ? 'disabled' : '',
        // 'active' class makes "button" look pressed
        this.is_Checked ? 'active' : '',
        // Focus class makes button look focused
        this.hasFocus ? 'focus' : ''
      ]
    }
  },
  methods: {
    handleFocus (evt) {
      // When in buttons mode, we need to add 'focus' class to label when radio focused
      if (this.is_BtnMode && evt.target) {
        if (evt.type === 'focus') {
          this.hasFocus = true
        } else if (evt.type === 'blur') {
          this.hasFocus = false
        }
      }
    }
  }
}
