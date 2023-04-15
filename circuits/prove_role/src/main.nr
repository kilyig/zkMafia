use dep::std;

fn main(
    role_hashes: pub [Field;5],
    role: pub u4,
    salt: u32,
) {
    // first, prove that you are one of the players
    let role_hash = std::hash::pedersen([role as Field, salt as Field])[0];
    let mut is_playing = 0;
    for i in 0..5 {
        if(role_hash == role_hashes[i]) {
            is_playing = 1;
        }
    }
    constrain is_playing == 1;
}