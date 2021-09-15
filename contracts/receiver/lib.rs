#![cfg_attr(not(feature = "std"), no_std)]

#[ink_lang::contract]
mod receiver {
    use metis_erc721::TokenId;

    use ink_prelude::vec::Vec;

    #[ink(storage)]
    pub struct Receiver {

    }

    /// Emitted when contract is received the erc721 `token_id` token is transferred from `from` to `to`.
    #[ink(event)]
    pub struct Erc721Received {
        #[ink(topic)]
        pub operator: AccountId,
        #[ink(topic)]
        pub from: AccountId,
        #[ink(topic)]
        pub token_id: TokenId,
        pub data: Vec<u8>,
    }

    impl Receiver {
        #[ink(constructor)]
        pub fn new() -> Self {
            // let mut res = Self::default();
            Self { }
        }

        #[ink(message)]
        pub fn on_erc721_received(
            &mut self,
            operator: AccountId,
            from: AccountId,
            token_id: TokenId,
            data: Vec<u8>,
        ) -> [u8; 4] {
            let reject_id = TokenId::new([0x0c_u8; 32]);

            if token_id == reject_id {
                // Default value
                return [0u8, 0u8, 0u8, 0u8]
            }

            // if self.erc721_receive.contains_key(&Self::env().caller()) {
            Self::env().emit_event(Erc721Received {
                operator,
                from,
                token_id,
                data,
            });

            ink_env::debug_println!("receive an erc712 token, from contract:{:?}, id:{:?}", from, token_id);
                // [90u8, 119u8, 73u8, 174u8]
            metis_lang::selector_id!(on_erc721_received)
            // } else {
            //     [0u8, 0u8, 0u8, 0u8]
            // }
        }
    }
    
}