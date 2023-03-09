import AsyncSelect from './AsyncSelect';
import networkService from '../../services/networkService';

const IGNORE = '||$$IGNORE$$||';

const JobTitleSelector = ({ onChange, size = 'sm', isMulti, value = IGNORE }) => {
  const promiseOptions = async (inputValue) => {
    const searchParams = new URLSearchParams();
    searchParams.set('search', inputValue);
    const query = searchParams.toString();
    const response = networkService.jobTitleSearch(query);
    return response.then((res) => {
      return res.results.map((result) => {
        return { value: result.id, label: result.name };
      });
    });
  };

  return value !== IGNORE ? (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={onChange}
      size={size}
      isMulti={isMulti}
      value={value}
    />
  ) : (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={onChange}
      size={size}
      isMulti={isMulti}
    />
  );
};

export default JobTitleSelector;
