export type ClusterLink = {
    "version": "0.1.0",
    "name": "cluster_link",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "account",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "size",
            "type": "u64"
          },
          {
            "name": "lamports",
            "type": "u64"
          }
        ],
        
      },
      {
        "name": "fill",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "account",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "l",
            "type": "u64"
          },
          {
            "name": "r",
            "type": "u64"
          },
          {
            "name": "data",
            "type": {
              "array": [
                "u8",
                1024
              ]
            }
          }
        ],
        
      }
    ]
  };
  
  export const IDL: ClusterLink = {
    "version": "0.1.0",
    "name": "cluster_link",
    "instructions": [
      {
        "name": "initialize",
        "accounts": [
          {
            "name": "signer",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "account",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "size",
            "type": "u64"
          },
          {
            "name": "lamports",
            "type": "u64"
          }
        ],
        
      },
      {
        "name": "fill",
        "accounts": [
          {
            "name": "signer",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "account",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "l",
            "type": "u64"
          },
          {
            "name": "r",
            "type": "u64"
          },
          {
            "name": "data",
            "type": {
              "array": [
                "u8",
                1024
              ]
            }
          }
        ],
        
      }
    ]
  };
  