import FilterTraits from "./filter_traits";
import { MOONBIRD_FILTER_TRAITS } from "../filterTraits";

const MoonBirdsFilterTraits = () => {
  return (
    <FilterTraits
      theme="violet"
      collection="moonbirds"
      filterTraits={MOONBIRD_FILTER_TRAITS}
    />
  );
};

export default MoonBirdsFilterTraits;