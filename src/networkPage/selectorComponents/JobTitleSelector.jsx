import { AsyncSelect } from "chakra-react-select";
import networkService from "../../services/networkService";

const JobTitleSelector = ({ onChange, size = "sm" }) => {
  const promiseOptions = async (inputValue) => {
    const searchParams = new URLSearchParams();
    searchParams.set('search', inputValue);
    const query = searchParams.toString()
    const response = networkService.jobTitleSearch(query);
    return response.then((res) => {
      return res.results.map((result) => {
        return { value: result.id, label: result.name };
      })
    });
  };

  return (
    <AsyncSelect 
      cacheOptions 
      defaultOptions 
      loadOptions={promiseOptions}
      onChange={onChange}
      size={size}
      isMulti={true}
    />
  )
};

export default JobTitleSelector;