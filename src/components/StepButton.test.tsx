import { fireEvent, render } from '@testing-library/react-native';
import { StepButton } from './StepButton';

describe('StepButton', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('steps once on a normal tap', async () => {
    const onStep = jest.fn();
    const { getByRole } = await render(<StepButton label="+" onStep={onStep} />);

    const button = getByRole('button');
    await fireEvent(button, 'pressIn');
    await fireEvent(button, 'pressOut');
    await fireEvent.press(button);

    expect(onStep).toHaveBeenCalledTimes(1);
  });

  it('keeps stepping on an interval while held, and stops on release', async () => {
    jest.useFakeTimers();
    const onStep = jest.fn();
    const { getByRole } = await render(<StepButton label="+" onStep={onStep} />);

    const button = getByRole('button');
    await fireEvent(button, 'pressIn');

    await jest.advanceTimersByTimeAsync(400); // hold delay
    expect(onStep).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(300); // 3 more repeat ticks at 100ms
    expect(onStep).toHaveBeenCalledTimes(4);

    await fireEvent(button, 'pressOut');
    await fireEvent.press(button); // release fires onPress too, but the hold already covered it

    await jest.advanceTimersByTimeAsync(1000);
    expect(onStep).toHaveBeenCalledTimes(4);
  });
});
