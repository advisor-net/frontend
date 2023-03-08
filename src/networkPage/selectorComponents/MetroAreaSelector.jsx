import AsyncSelect from '../../components/AsyncSelect';
import networkService from '../../services/networkService';

const MetroAreaSelector = ({ onChange, size = 'sm' }) => {
  const promiseOptions = async (inputValue) => {
    const searchParams = new URLSearchParams();
    searchParams.set('search', inputValue);
    const query = searchParams.toString();
    const response = networkService.metroAreaSearch(query);
    return response.then((res) => {
      return res.results.map((result) => {
        return { value: result.id, label: result.name };
      });
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
  );
};

export default MetroAreaSelector;
