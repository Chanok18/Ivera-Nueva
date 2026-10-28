import java.io.Console;
import java.util.Scanner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarHash {
    public static void main(String[] args) {
        Console consola = System.console();
        char[] password;

        if (consola != null) {
            password = consola.readPassword("Nueva contraseña ADMIN: ");
        } else {
            System.out.print("Nueva contraseña ADMIN: ");
            password = new Scanner(System.in).nextLine().toCharArray();
        }

        if (password.length < 12) {
            System.err.println("Usa una contraseña de al menos 12 caracteres.");
            return;
        }

        String hash = new BCryptPasswordEncoder().encode(new String(password));
        java.util.Arrays.fill(password, '\0');
        System.out.println(hash);
    }
}
