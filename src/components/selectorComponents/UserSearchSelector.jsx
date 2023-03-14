import AsyncSelect from './AsyncSelect';
import networkService from '../../services/networkService';

const IGNORE = '||$$IGNORE$$||';

const UserSearchSelector = ({ onChange, size = 'sm', isMulti, value = IGNORE }) => {
  const promiseOptions = async (inputValue) => {
    const searchParams = new URLSearchParams();
    searchParams.set('search', inputValue);
    searchParams.set('order_by', 'handle');
    const query = searchParams.toString();
    const response = networkService.userSearch(query);
    return response.then((res) => {
      return res.results.map((result) => {
        return { value: result.handle, label: result.handle, ...result };
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
      placeholder="Search for handle"
    />
  ) : (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={promiseOptions}
      onChange={onChange}
      size={size}
      isMulti={isMulti}
      placeholder="Search for handle"
    />
  );
};

export default UserSearchSelector;
