export const valid = {
  __pass: true,
  type: "Number",
  config: {
    label: "Number",
    placeholder: "Choose a number"
  }
}

export const wrongType = {
  __pass: false,
  type: "Number2",
  config: {
    label: "Number",
    placeholder: "Choose a number"
  }
}

export const noConfig = {
  __pass: false,
  type: "Number",
}