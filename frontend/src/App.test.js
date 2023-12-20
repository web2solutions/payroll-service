import { render, screen, fireEvent,  } from '@testing-library/react';
// import { renderHook } from '@testing-library/react-hooks'
import App from './App';

test('renders learn react link', () => {
  // const { result } = renderHook(() => App())
  
  const { getByTestId, getAllByTestId } = render(<App />);


  const linkElement = screen.getByText(/search/i);
  expect(linkElement).toBeInTheDocument();

  
  let options = getAllByTestId('Bedrooms-option');

  fireEvent.change(getByTestId('Bedrooms'), { target: { value: 3 } })

  console.log(options)
  //expect(options[0].selected).toBeTruthy();
  //expect(options[1].selected).toBeFalsy();
  // expect(options[2].selected).toBeFalsy();
  
});
