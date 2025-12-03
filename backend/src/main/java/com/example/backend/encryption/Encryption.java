package com.example.backend.encryption;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.security.SecureRandom;

public class Encryption {

    // AES GCM encryption
    private static final String AES_ALGORITHM = "AES/GCM/NoPadding";
    private static final int KEY_SIZE = 256;  // AES-256
    private static final int GCM_TAG_LENGTH = 16;  // GCM authentication tag length

    // Generate AES secret key
    public static SecretKey generateSecretKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(KEY_SIZE);
        return keyGen.generateKey();
    }

    // Encrypt data (matricule) using AES GCM
    public static String encrypt(String matricule, SecretKey secretKey) throws Exception {
        // Create a random IV (Initialization Vector)
        byte[] iv = new byte[12];  // 12 bytes IV for AES GCM
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv);

        // Set up the GCM parameter spec
        GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);

        // Create cipher for AES/GCM encryption
        Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, gcmSpec);

        // Encrypt the data
        byte[] encryptedMatricule = cipher.doFinal(matricule.getBytes(StandardCharsets.UTF_8));

        // Combine the IV and encrypted data, then encode to Base64
        byte[] encryptedDataWithIv = new byte[iv.length + encryptedMatricule.length];
        System.arraycopy(iv, 0, encryptedDataWithIv, 0, iv.length);
        System.arraycopy(encryptedMatricule, 0, encryptedDataWithIv, iv.length, encryptedMatricule.length);

        return Base64.getEncoder().encodeToString(encryptedDataWithIv);
    }

    // Decrypt data (matricule) using AES GCM
    public static String decrypt(String encryptedMatricule, SecretKey secretKey) throws Exception {
        // Decode the Base64 encoded data
        byte[] encryptedDataWithIv = Base64.getDecoder().decode(encryptedMatricule);

        // Extract the IV from the encrypted data
        byte[] iv = new byte[12];  // 12 bytes IV for AES GCM
        System.arraycopy(encryptedDataWithIv, 0, iv, 0, iv.length);

        // Extract the encrypted matricule data
        byte[] encryptedData = new byte[encryptedDataWithIv.length - iv.length];
        System.arraycopy(encryptedDataWithIv, iv.length, encryptedData, 0, encryptedData.length);

        // Set up the GCM parameter spec
        GCMParameterSpec gcmSpec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, iv);

        // Create cipher for AES/GCM decryption
        Cipher cipher = Cipher.getInstance(AES_ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, gcmSpec);

        // Decrypt the data
        byte[] decryptedMatricule = cipher.doFinal(encryptedData);

        return new String(decryptedMatricule, StandardCharsets.UTF_8);
    }
}
