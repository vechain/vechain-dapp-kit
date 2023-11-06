import styled from 'styled-components';

const Button = styled.button`
    padding: 15px 20px;
    border: none;
    cursor: pointer;
    width: 100%;
    border-radius: 12px;
    font-family: 'Inter';
    font-weight: 500;
    color: ${(props) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return props.theme.textColor;
    }};
    background-color: ${(props) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return props.theme.modalButtonBackgroundColor;
    }};
`;

const ButtonContent = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
`;

const Image = styled.img`
    width: 35px;
    height: 35px;
`;

interface WalletButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    walletName: string;
    walletImageUrl: string;
}

const WalletButton = ({
    walletName,
    walletImageUrl,
    ...restProps
}: WalletButtonProps) => {
    return (
        <Button {...restProps}>
            <ButtonContent>
                <div>{walletName}</div>
                <Image src={walletImageUrl} />
            </ButtonContent>
        </Button>
    );
};

export { WalletButton };
