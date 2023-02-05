import "../styles/faq.css";
import type { ReactElement } from "react";
import React, { useCallback, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const faqItems: Array<[string, string]> = [
    ["How long does it take for my order to complete?",
        "jewl.app bundles similar orders together giving you a better price " +
        "with lower fees for your purchase. Orders should be executed within " +
        "a few hours of their scheduled exucution time. If you think something " +
        "is wrong feel free to send us a message and we'll be happy to help!"],
    ["Why do I need a non-custodial wallet?",
        "Custodial wallets might be convenient and you won't need to pay transfer " +
        "fees, you are trusting someone else with complete control of your assets. " +
        "With a non-custodial wallet you are in full control. Take a look at what " +
        "happened to FTX or QuadrigaCX for an example of the risks. Not your keys, " +
        "not your coins."],
    ["What is the best crypto wallet?",
        "While we don't think there is a single best wallet out there. We do think " +
        "that you should invest in a quality hardware wallet if you are serious about " +
        "crypto investing. A hardware wallet keeps your private keys, and thus your assets, " +
        "safe on a secure physical device that is disconected from the internet."],
    ["What cryptocurrency should I buy?",
        "While we cannot give you a definitive answer to that question, " +
        "it is a good idea to diversify your portfolio across different blockchains."],
    ["I accidentally sent my cryptocurrency to the wrong wallet. What can I do?",
        "All crypto transactions are final. If you have access to the wallet that " +
        "you can simply transfer the tokens to a wallet of your choice. If you do not " +
        "have access to the wallet your funds are unfortunately lost forever. Please " +
        "always triple check when entering wallet addresses for receing crypto assets."],
    ["What are transaction fees and why am I paying them?",
        "To transfer crypto assets from one wallet to another we need to pay a small " +
        "fee to make sure our transaction gets validated and included in the blockchain " +
        "ledger. These fees can be compared to payment fees charged in traditional " +
        "finance. Because jewl.app transfers the crypto assets directly into your own " +
        "wallet, transfer fees will need to be payed for the transfer."],
    ["Some of my orders seem to be fulfilled by Coinbase. Why is that?",
        "jewl.app buys and sells cryptocurrencies through Coinbase to get you the best price for " +
        "you. We sometimes transfer assets directly from our Coinbase account to your " +
        "wallet. If you were wondering, we only keep a small active balance on our " +
        "Coinbase account. All our longer-term holds are safely stored on a hardware " +
        "wallet."]
];

interface IProps {
    item: [string, string];
    selected: boolean;
    handler: () => void;
}

const FrequentlyAskedQuestionsItem = (props: IProps): ReactElement => {
    return (
        <div className="faq-item">
            <div className="faq-item-banner" onClick={props.handler}>
                <span className="faq-item-title">{props.item[0]}</span>
                <FontAwesomeIcon className="faq-item-chevron" icon={props.selected ? faChevronUp : faChevronDown} />
            </div>
            <div className="faq-item-text" hidden={!props.selected}>
                {props.item[1]}
            </div>
        </div>
    );
};

export const FrequentlyAskedQuestions = (): ReactElement => {
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);

    const itemClicked = faqItems.map((_, i) => useCallback(() => setCurrentIndex(i === currentIndex ? null : i), [currentIndex]));

    const items = useMemo(() => {
        return faqItems.map((x, i) => <FrequentlyAskedQuestionsItem key={x[0]} item={x} selected={currentIndex === i} handler={itemClicked[i]} />);
    }, [currentIndex]);

    return (
        <div className="faq">
            <div className="faq-title">Frequently Asked Quetions (FAQ)</div>
            {items}
        </div>
    );
};
