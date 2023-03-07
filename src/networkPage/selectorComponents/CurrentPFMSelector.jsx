import { Select } from "chakra-react-select";

const CURRENT_PFM_KEYS = {
  MINT: 'mint',
  ROCKET_MONEY: 'rocket money',
  CHIME: 'chime',
  SPLITWISE: 'splitwise',
  PEN_PAPER: 'pen paper',
  NONE: 'none',
};

export const CURRENT_PFM_LABELS = {
  [CURRENT_PFM_KEYS.MINT]: 'Mint',
  [CURRENT_PFM_KEYS.ROCKET_MONEY]: 'Rocket Money',
  [CURRENT_PFM_KEYS.CHIME]: 'Chime',
  [CURRENT_PFM_KEYS.SPLITWISE]: 'Splitwise',
  [CURRENT_PFM_KEYS.PEN_PAPER]: 'Pen & paper',
  [CURRENT_PFM_KEYS.NONE]: 'None',
}

const OPTIONS = Object.entries(CURRENT_PFM_LABELS).map(([value, label]) => {
  return { value, label };
});

const CurrentPFMSelector = ({ onChange, size = "sm" }) => {
  return (
    <Select 
      onChange={onChange}
      options={OPTIONS}
      size={size}
    />
  )
};

export default CurrentPFMSelector;
